import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { normalizeArabicText } from '../../processing/arabicNormalizer';

export class ExactStrategy implements SearchStrategy {
  name = 'exact_match';
  weight = 1.0;

  public search(query: SearchQuery): CandidateResult[] {
    const results: CandidateResult[] = [];
    const norm = normalizeArabicText(query.rawQuery);
    if (!norm) return results;

    // 1. Entities & Aliases Exact Match
    for (const entity of db.getAllEntities()) {
      if (entity.normalizedName === norm) {
        results.push({
          id: `exact_ent_${entity.id}`,
          type: 'entity',
          title: entity.name,
          entityId: entity.id,
          entityName: entity.name,
          matchedText: entity.name,
          strategyScores: { exact_match: 1.0 },
          rawScore: 1.0,
          finalScore: 1.0,
          relevanceExplanation: `تطابق تام مع الكيان "${entity.name}"`,
          metadata: { entity, attributes: db.getAttributesForEntity(entity.id) }
        });
      } else if (entity.normalizedAliases.includes(norm)) {
        results.push({
          id: `exact_alias_${entity.id}`,
          type: 'entity',
          title: entity.name,
          entityId: entity.id,
          entityName: entity.name,
          matchedText: `اسم بديل: ${entity.name}`,
          strategyScores: { exact_match: 0.98 },
          rawScore: 0.98,
          finalScore: 0.98,
          relevanceExplanation: `تطابق تام مع الاسم البديل للكيان "${entity.name}"`,
          metadata: { entity, attributes: db.getAttributesForEntity(entity.id) }
        });
      }
    }

    // 2. Exact Attribute Key or Aliases match
    for (const attr of db.getAllAttributes()) {
      if (attr.normalizedKey === norm || attr.normalizedAliases.includes(norm)) {
        const entity = db.getEntity(attr.entityId);
        results.push({
          id: `exact_attr_${attr.id}`,
          type: 'attribute',
          title: `${entity ? entity.name + ' - ' : ''}${attr.key}`,
          entityId: attr.entityId,
          entityName: entity?.name,
          attributeKey: attr.key,
          attributeValue: attr.value,
          unit: attr.unit,
          matchedText: `${attr.key}: ${attr.value} ${attr.unit || ''}`,
          strategyScores: { exact_match: 0.95 },
          rawScore: 0.95,
          finalScore: 0.95,
          relevanceExplanation: `تطابق مباشر لخاصية "${attr.key}"`,
          metadata: { attribute: attr, entity }
        });
      }
    }

    // 3. Exact Document Title Match
    for (const doc of db.getAllDocuments()) {
      if (doc.normalizedTitle === norm) {
        results.push({
          id: `exact_doc_${doc.id}`,
          type: 'document',
          title: doc.title,
          matchedText: doc.title,
          strategyScores: { exact_match: 0.95 },
          rawScore: 0.95,
          finalScore: 0.95,
          relevanceExplanation: `تطابق تام مع عنوان المستند "${doc.title}"`,
          metadata: { document: doc }
        });
      }
    }

    return results;
  }
}
