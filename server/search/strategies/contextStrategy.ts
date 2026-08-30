import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { detectRequestedAttribute } from '../../processing/dialectMapper';

export class ContextStrategy implements SearchStrategy {
  name = 'context_boost';
  weight = 0.85;

  public search(query: SearchQuery): CandidateResult[] {
    const results: CandidateResult[] = [];
    const contextIds = query.contextEntityIds || [];

    if (contextIds.length === 0) return results;

    const detectedAttr = query.requestedAttribute || detectRequestedAttribute(query.normalizedQuery).attribute;

    for (const entId of contextIds) {
      const entity = db.getEntity(entId);
      if (!entity) continue;

      const attrs = db.getAttributesForEntity(entId);

      // If an attribute is requested, boost that specific attribute
      if (detectedAttr) {
        const attr = attrs.find(a => a.key === detectedAttr || a.normalizedAliases.includes(detectedAttr));
        if (attr) {
          results.push({
            id: `ctx_attr_${attr.id}`,
            type: 'attribute',
            title: `${entity.name} - ${attr.key}`,
            entityId: entity.id,
            entityName: entity.name,
            attributeKey: attr.key,
            attributeValue: attr.value,
            unit: attr.unit,
            matchedText: `${entity.name} ${attr.key}: ${attr.value}`,
            strategyScores: { context_boost: 0.96 },
            rawScore: 0.96,
            finalScore: 0.96,
            relevanceExplanation: `ربط سياقي: خاصية "${attr.key}" للكيان النشط في المحادثة "${entity.name}"`,
            metadata: { attribute: attr, entity }
          });
        }
      }

      // Also add entity context boost
      results.push({
        id: `ctx_ent_${entity.id}`,
        type: 'entity',
        title: entity.name,
        entityId: entity.id,
        entityName: entity.name,
        matchedText: entity.name,
        strategyScores: { context_boost: 0.80 },
        rawScore: 0.80,
        finalScore: 0.80,
        relevanceExplanation: `كيان نشط من سياق المحادثة السابق "${entity.name}"`,
        metadata: { entity, attributes: attrs }
      });
    }

    return results;
  }
}
