import { db } from '../database/memoryStore';
import { IngestionResult, EntityInputDTO } from './types';
import { ATTRIBUTE_SYNONYMS } from '../processing/dialectMapper';

export class KnowledgeParser {
  /**
   * Ingest structured entity DTO into the database
   */
  public static ingestEntity(dto: EntityInputDTO | any): IngestionResult {
    const result: IngestionResult = {
      success: true,
      insertedEntities: 0,
      insertedAttributes: 0,
      insertedRelationships: 0,
      insertedDocuments: 0,
      insertedFacts: 0,
      errors: []
    };

    try {
      const name = dto.name || dto.term || dto.title;
      if (!name) {
        result.errors.push('Entity name/term is required');
        result.success = false;
        return result;
      }

      // Check if entity already exists
      let entity = db.findEntityByNameOrAlias(name);
      if (!entity) {
        entity = db.addEntity({
          id: dto.id,
          name: name,
          type: dto.type || 'Concept',
          aliases: dto.aliases || [],
          category: dto.category,
          description: dto.description || dto.definition,
          metadata: {
            ...(dto.metadata || {}),
            source_refs: dto.source_refs || []
          }
        });
        result.insertedEntities++;
      } else {
        // Update description if missing
        if (!entity.description && (dto.description || dto.definition)) {
          entity.description = dto.description || dto.definition;
        }
        if (dto.source_refs && dto.source_refs.length > 0) {
          entity.metadata = {
            ...(entity.metadata || {}),
            source_refs: Array.from(new Set([...(entity.metadata?.source_refs || []), ...dto.source_refs]))
          };
        }
      }

      // Ingest attributes
      if (dto.attributes) {
        if (Array.isArray(dto.attributes)) {
          for (const attr of dto.attributes) {
            const canonicalSynonyms = ATTRIBUTE_SYNONYMS[attr.key] || [];
            const combinedAliases = Array.from(new Set([...(attr.aliases || []), ...canonicalSynonyms]));
            db.addAttribute({
              entityId: entity.id,
              key: attr.key,
              value: attr.value,
              valueType: typeof attr.value === 'number' ? 'number' : typeof attr.value === 'object' ? 'object' : 'string',
              unit: attr.unit,
              aliases: combinedAliases,
              metadata: {
                source_refs: attr.source_refs || dto.source_refs || []
              }
            });
            result.insertedAttributes++;
          }
        } else if (typeof dto.attributes === 'object') {
          for (const [key, val] of Object.entries(dto.attributes)) {
            const canonicalSynonyms = ATTRIBUTE_SYNONYMS[key] || [];
            db.addAttribute({
              entityId: entity.id,
              key,
              value: val,
              valueType: typeof val === 'number' ? 'number' : typeof val === 'object' ? 'object' : 'string',
              aliases: canonicalSynonyms,
              metadata: {
                source_refs: dto.source_refs || []
              }
            });
            result.insertedAttributes++;
          }
        }
      }

      // Ingest relationships
      if (dto.relationships && Array.isArray(dto.relationships)) {
        for (const rel of dto.relationships) {
          const targetName = rel.target || rel.object;
          let targetEntity = targetName ? db.findEntityByNameOrAlias(targetName) : undefined;
          if (!targetEntity && targetName) {
            targetEntity = db.addEntity({
              name: targetName,
              type: 'Concept'
            } as any);
          }

          if (targetEntity) {
            db.addRelationship({
              sourceEntityId: entity.id,
              targetEntityId: targetEntity.id,
              relationType: rel.relationType || rel.relation || 'related_to',
              metadata: {
                context: rel.context,
                source_refs: rel.source_refs || dto.source_refs || []
              }
            });
            result.insertedRelationships++;
          }
        }
      }

    } catch (e: any) {
      result.errors.push(e.message);
      result.success = false;
    }

    return result;
  }

  /**
   * Ingest JSON payload (can be an entity, list of entities, documents, or knowledge bundle)
   */
  public static ingestJSON(jsonContent: any): IngestionResult {
    const totalResult: IngestionResult = {
      success: true,
      insertedEntities: 0,
      insertedAttributes: 0,
      insertedRelationships: 0,
      insertedDocuments: 0,
      insertedFacts: 0,
      errors: []
    };

    let data = jsonContent;
    if (typeof jsonContent === 'string') {
      try {
        data = JSON.parse(jsonContent);
      } catch (err: any) {
        totalResult.errors.push(`JSON Parse Error: ${err.message}`);
        totalResult.success = false;
        return totalResult;
      }
    }

    // 1. Entities
    if (data.entities && Array.isArray(data.entities)) {
      for (const ent of data.entities) {
        const res = this.ingestEntity(ent);
        totalResult.insertedEntities += res.insertedEntities;
        totalResult.insertedAttributes += res.insertedAttributes;
        totalResult.insertedRelationships += res.insertedRelationships;
        totalResult.errors.push(...res.errors);
      }
    }

    // 2. Terms
    if (data.terms && Array.isArray(data.terms)) {
      for (const t of data.terms) {
        const termName = t.term || t.name;
        if (!termName) continue;

        // Ingest as Entity
        const entRes = this.ingestEntity({
          id: t.id,
          name: termName,
          type: 'Term',
          aliases: t.aliases || [],
          description: t.definition || t.description,
          source_refs: t.source_refs || []
        });
        totalResult.insertedEntities += entRes.insertedEntities;

        // Also add definition attribute
        const ent = db.findEntityByNameOrAlias(termName);
        if (ent && (t.definition || t.description)) {
          db.addAttribute({
            entityId: ent.id,
            key: 'التعريف',
            value: t.definition || t.description,
            valueType: 'string',
            aliases: ['تعريف', 'المفهوم', 'المعنى', 'definition', 'meaning'],
            metadata: { source_refs: t.source_refs || [] }
          });
          totalResult.insertedAttributes++;
        }

        // Also add as Fact
        if (t.definition || t.description) {
          db.addFact({
            subject: termName,
            predicate: 'هو/تعريفه',
            object: t.definition || t.description,
            rawText: `${termName}: ${t.definition || t.description}`,
            category: 'مصطلحات ومفاهيم',
            metadata: {
              source_refs: t.source_refs || []
            }
          });
          totalResult.insertedFacts++;
        }
      }
    }

    // 3. Facts
    if (data.facts && Array.isArray(data.facts)) {
      for (const f of data.facts) {
        const sub = f.subject || '';
        const pred = f.predicate || '';
        const obj = f.object || f.value || '';
        const raw = f.rawText || `${sub} ${pred} ${obj}`.trim();

        db.addFact({
          id: f.id,
          subject: sub,
          predicate: pred,
          object: obj,
          rawText: raw,
          category: f.category || f.context || 'حقائق عامة',
          metadata: {
            context: f.context,
            conditions: f.conditions,
            exceptions: f.exceptions,
            source_refs: f.source_refs || []
          }
        });
        totalResult.insertedFacts++;
      }
    }

    // 4. Standalone Relationships
    if (data.relationships && Array.isArray(data.relationships)) {
      for (const rel of data.relationships) {
        const subName = rel.subject || rel.source;
        const objName = rel.object || rel.target;
        if (!subName || !objName) continue;

        let srcEnt = db.findEntityByNameOrAlias(subName);
        if (!srcEnt) {
          srcEnt = db.addEntity({ name: subName, type: 'Concept' } as any);
          totalResult.insertedEntities++;
        }

        let tgtEnt = db.findEntityByNameOrAlias(objName);
        if (!tgtEnt) {
          tgtEnt = db.addEntity({ name: objName, type: 'Concept' } as any);
          totalResult.insertedEntities++;
        }

        db.addRelationship({
          id: rel.id,
          sourceEntityId: srcEnt.id,
          targetEntityId: tgtEnt.id,
          relationType: rel.relation || rel.relationType || 'مرتبط بـ',
          metadata: {
            context: rel.context,
            source_refs: rel.source_refs || []
          }
        });
        totalResult.insertedRelationships++;
      }
    }

    // 5. Documents
    if (data.documents && Array.isArray(data.documents)) {
      for (const doc of data.documents) {
        db.addDocument({
          id: doc.id,
          title: doc.title || 'Untitled Document',
          content: doc.content || doc.text || '',
          summary: doc.summary,
          category: doc.category || doc.context,
          tags: doc.tags || [],
          metadata: {
            author: doc.author,
            institution: doc.institution,
            context: doc.context,
            source_refs: doc.source_refs || []
          }
        });
        totalResult.insertedDocuments++;
      }
    }

    // If single entity array or single entity object
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.name) {
          const res = this.ingestEntity(item);
          totalResult.insertedEntities += res.insertedEntities;
          totalResult.insertedAttributes += res.insertedAttributes;
          totalResult.errors.push(...res.errors);
        } else if (item.title && item.content) {
          db.addDocument(item);
          totalResult.insertedDocuments++;
        }
      }
    } else if (data.name && !data.entities) {
      const res = this.ingestEntity(data);
      totalResult.insertedEntities += res.insertedEntities;
      totalResult.insertedAttributes += res.insertedAttributes;
      totalResult.errors.push(...res.errors);
    }

    totalResult.success = totalResult.errors.length === 0;
    return totalResult;
  }

  /**
   * Ingest CSV format
   */
  public static ingestCSV(csvText: string): IngestionResult {
    const result: IngestionResult = {
      success: true,
      insertedEntities: 0,
      insertedAttributes: 0,
      insertedRelationships: 0,
      insertedDocuments: 0,
      insertedFacts: 0,
      errors: []
    };

    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return result;

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const entityIdx = headers.indexOf('entity');
    const attrIdx = headers.indexOf('attribute');
    const valIdx = headers.indexOf('value');
    const unitIdx = headers.indexOf('unit');
    const aliasIdx = headers.indexOf('aliases');
    const catIdx = headers.indexOf('category');

    if (entityIdx === -1) {
      result.errors.push('CSV must contain an "entity" column');
      result.success = false;
      return result;
    }

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      const entityName = parts[entityIdx];
      if (!entityName) continue;

      let entity = db.findEntityByNameOrAlias(entityName);
      if (!entity) {
        entity = db.addEntity({
          name: entityName,
          type: 'entity',
          category: catIdx !== -1 ? parts[catIdx] : undefined,
          aliases: aliasIdx !== -1 && parts[aliasIdx] ? parts[aliasIdx].split(';').map(s => s.trim()) : []
        } as any);
        result.insertedEntities++;
      }

      if (attrIdx !== -1 && valIdx !== -1 && parts[attrIdx] && parts[valIdx]) {
        const attrKey = parts[attrIdx];
        const val = isNaN(Number(parts[valIdx])) ? parts[valIdx] : Number(parts[valIdx]);
        const unit = unitIdx !== -1 ? parts[unitIdx] : undefined;

        db.addAttribute({
          entityId: entity.id,
          key: attrKey,
          value: val,
          valueType: typeof val === 'number' ? 'number' : 'string',
          unit,
          aliases: ATTRIBUTE_SYNONYMS[attrKey] || []
        });
        result.insertedAttributes++;
      }
    }

    return result;
  }

  /**
   * Ingest plain text or Markdown article / FAQ document
   */
  public static ingestText(title: string, content: string, category?: string, metadata?: Record<string, any>): IngestionResult {
    db.addDocument({
      title,
      content,
      category: category || 'general_doc',
      metadata
    });

    return {
      success: true,
      insertedEntities: 0,
      insertedAttributes: 0,
      insertedRelationships: 0,
      insertedDocuments: 1,
      insertedFacts: 0,
      errors: []
    };
  }
}
