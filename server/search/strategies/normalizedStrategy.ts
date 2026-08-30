import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { cleanColloquialFillers } from '../../processing/dialectMapper';

export class NormalizedStrategy implements SearchStrategy {
  name = 'normalized_match';
  weight = 0.90;

  public search(query: SearchQuery): CandidateResult[] {
    const results: CandidateResult[] = [];
    const norm = query.normalizedQuery;
    if (!norm) return results;

    const cleanedQuery = cleanColloquialFillers(norm);

    // 1. Entities Substring / Phrase Match
    const allEntities = [...db.getAllEntities()].sort((a, b) => b.normalizedName.length - a.normalizedName.length);

    for (const entity of allEntities) {
      let score = 0;
      let matchedTerm = '';

      if (norm === entity.normalizedName) {
        score = 0.98;
        matchedTerm = entity.name;
      } else if (norm.includes(entity.normalizedName)) {
        score = 0.90 + Math.min(0.08, (entity.normalizedName.length / norm.length) * 0.08);
        matchedTerm = entity.name;
      } else if (cleanedQuery && cleanedQuery.includes(entity.normalizedName)) {
        score = 0.92;
        matchedTerm = entity.name;
      } else {
        // Check aliases sorted by length descending
        const sortedAliases = [...entity.normalizedAliases].sort((a, b) => b.length - a.length);
        for (const alias of sortedAliases) {
          if (norm === alias) {
            score = 0.96;
            matchedTerm = alias;
            break;
          } else if (norm.includes(alias) || (cleanedQuery && cleanedQuery.includes(alias))) {
            score = 0.85 + Math.min(0.12, (alias.length / norm.length) * 0.12);
            matchedTerm = alias;
            break;
          }
        }
      }

      if (score > 0) {
        results.push({
          id: `norm_ent_${entity.id}`,
          type: 'entity',
          title: entity.name,
          entityId: entity.id,
          entityName: entity.name,
          matchedText: `${entity.name} (${matchedTerm})`,
          strategyScores: { normalized_match: score },
          rawScore: score,
          finalScore: score,
          relevanceExplanation: `تطابق نصي مع "${matchedTerm}"`,
          metadata: { entity, attributes: db.getAttributesForEntity(entity.id) }
        });
      }
    }

    // 2. Documents Substring & Keyword Match
    const queryTokens = norm.split(/\s+/).filter(t => t.length > 2);

    for (const doc of db.getAllDocuments()) {
      let docScore = 0;
      let matchedReason = '';

      if (doc.normalizedTitle.includes(cleanedQuery || norm) || doc.normalizedContent.includes(cleanedQuery || norm)) {
        docScore = 0.95;
        matchedReason = `تطابق تام مع محتوى/عنوان "${doc.title}"`;
      } else {
        // Check token matches
        let matchedCount = 0;
        for (const token of queryTokens) {
          if (doc.normalizedTitle.includes(token) || doc.normalizedContent.includes(token)) {
            matchedCount++;
          }
        }
        if (queryTokens.length > 0 && matchedCount >= 2) {
          docScore = Math.min(0.92, 0.65 + (matchedCount / queryTokens.length) * 0.30);
          matchedReason = `تطابق ${matchedCount} كلمات مع مستند "${doc.title}"`;
        }
      }

      if (docScore > 0) {
        results.push({
          id: `norm_doc_${doc.id}`,
          type: 'document',
          title: doc.title,
          matchedText: doc.content.slice(0, 150) + '...',
          strategyScores: { normalized_match: docScore },
          rawScore: docScore,
          finalScore: docScore,
          relevanceExplanation: matchedReason,
          metadata: { document: doc }
        });
      }
    }

    // 3. Facts Substring Match
    for (const fact of db.getAllFacts()) {
      if (fact.normalizedRawText.includes(cleanedQuery || norm) || (fact.normalizedSubject.includes(norm))) {
        results.push({
          id: `norm_fact_${fact.id}`,
          type: 'fact',
          title: `${fact.subject} - ${fact.predicate}`,
          matchedText: fact.rawText,
          strategyScores: { normalized_match: 0.88 },
          rawScore: 0.88,
          finalScore: 0.88,
          relevanceExplanation: `تطابق مع معلومة مؤكدة: ${fact.rawText}`,
          metadata: { fact }
        });
      }
    }

    return results;
  }
}
