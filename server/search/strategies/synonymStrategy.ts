import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { detectRequestedAttribute } from '../../processing/dialectMapper';

export class SynonymStrategy implements SearchStrategy {
  name = 'synonym_dialect';
  weight = 0.85;

  public search(query: SearchQuery): CandidateResult[] {
    const results: CandidateResult[] = [];
    const detectedAttr = query.requestedAttribute || detectRequestedAttribute(query.normalizedQuery).attribute;

    if (!detectedAttr) return results;

    // Find candidate entities in query or context
    const candidateEntities = query.detectedEntities && query.detectedEntities.length > 0
      ? query.detectedEntities.map(id => db.getEntity(id)!).filter(Boolean)
      : (query.contextEntityIds && query.contextEntityIds.length > 0
          ? query.contextEntityIds.map(id => db.getEntity(id)!).filter(Boolean)
          : db.getAllEntities().filter(e => query.normalizedQuery.includes(e.normalizedName) || e.normalizedAliases.some(a => query.normalizedQuery.includes(a))));

    for (const entity of candidateEntities) {
      const attrs = db.getAttributesForEntity(entity.id);
      const targetAttr = attrs.find(a => a.key === detectedAttr || a.normalizedAliases.includes(detectedAttr));

      if (targetAttr) {
        results.push({
          id: `syn_attr_${targetAttr.id}`,
          type: 'attribute',
          title: `${entity.name} - ${targetAttr.key}`,
          entityId: entity.id,
          entityName: entity.name,
          attributeKey: targetAttr.key,
          attributeValue: targetAttr.value,
          unit: targetAttr.unit,
          matchedText: `${targetAttr.key}: ${targetAttr.value} ${targetAttr.unit || ''}`,
          strategyScores: { synonym_dialect: 0.94 },
          rawScore: 0.94,
          finalScore: 0.94,
          relevanceExplanation: `تطابق مرادف/لهجة مصرية لخاصية "${targetAttr.key}" في "${entity.name}"`,
          metadata: { attribute: targetAttr, entity }
        });
      }
    }

    return results;
  }
}
