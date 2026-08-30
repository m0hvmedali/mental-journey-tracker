import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';

export class EntityStrategy implements SearchStrategy {
  name = 'entity_graph';
  weight = 0.95;

  public search(query: SearchQuery): CandidateResult[] {
    const results: CandidateResult[] = [];
    const entityIds = query.detectedEntities || [];

    for (const entId of entityIds) {
      const entity = db.getEntity(entId);
      if (!entity) continue;

      const attrs = db.getAttributesForEntity(entId);
      const rels = db.getRelationshipsForEntity(entId);

      results.push({
        id: `ent_graph_${entity.id}`,
        type: 'entity',
        title: entity.name,
        entityId: entity.id,
        entityName: entity.name,
        matchedText: `${entity.name}: ${entity.description || ''}`,
        strategyScores: { entity_graph: 0.95 },
        rawScore: 0.95,
        finalScore: 0.95,
        relevanceExplanation: `تطابق هيكلي مباشر مع الكيان "${entity.name}" وخصائصه (${attrs.length} خاصية)`,
        metadata: {
          entity,
          attributes: attrs,
          relationships: rels
        }
      });
    }

    return results;
  }
}
