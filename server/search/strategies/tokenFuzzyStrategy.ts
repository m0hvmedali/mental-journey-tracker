import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { stringSimilarity, tokenize } from '../../processing/tokenizer';
import { getConfig } from '../../config/chatbot.config';

const STOP_TOKENS = new Set([
  'ما', 'هو', 'هي', 'ماذا', 'كيف', 'متى', 'اين', 'لماذا', 'من', 'عن', 'في', 'إلى', 'على', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'سعر', 'دولة', 'مدينة', 'مكان'
]);

export class TokenFuzzyStrategy implements SearchStrategy {
  name = 'token_fuzzy';
  weight = 0.70;

  public search(query: SearchQuery): CandidateResult[] {
    const config = getConfig().search;
    const minThreshold = config.fuzzyThreshold || 0.68;
    const results: CandidateResult[] = [];

    const queryTokens = tokenize(query.rawQuery, false).filter(t => !STOP_TOKENS.has(t) && t.length >= 3);
    if (queryTokens.length === 0) return results;

    // Check entity names and aliases with fuzzy similarity
    for (const entity of db.getAllEntities()) {
      let maxSim = stringSimilarity(query.normalizedQuery, entity.normalizedName);
      let matchedTarget = entity.name;

      for (const alias of entity.normalizedAliases) {
        const sim = stringSimilarity(query.normalizedQuery, alias);
        if (sim > maxSim) {
          maxSim = sim;
          matchedTarget = alias;
        }
      }

      // Check token coverage
      if (queryTokens.length > 0) {
        const entTokens = tokenize(`${entity.name} ${entity.aliases.join(' ')}`, false).filter(t => !STOP_TOKENS.has(t));
        let matchedCount = 0;
        let bestTokenSim = 0;

        for (const qToken of queryTokens) {
          let tokenBest = 0;
          for (const eToken of entTokens) {
            const sim = stringSimilarity(qToken, eToken);
            if (sim > tokenBest) {
              tokenBest = sim;
            }
          }
          if (tokenBest >= 0.75) {
            matchedCount++;
            bestTokenSim = Math.max(bestTokenSim, tokenBest);
          }
        }

        // Token coverage score: proportion of query tokens matched * similarity
        const coverage = matchedCount / queryTokens.length;
        const compositeScore = coverage * bestTokenSim;
        if (compositeScore > maxSim) {
          maxSim = compositeScore;
          matchedTarget = entity.name;
        }
      }

      if (maxSim >= minThreshold) {
        const fuzzyScore = Math.min(0.92, maxSim * 0.90);
        results.push({
          id: `fuzzy_ent_${entity.id}`,
          type: 'entity',
          title: entity.name,
          entityId: entity.id,
          entityName: entity.name,
          matchedText: `مطابقة تقريبية مع: ${matchedTarget}`,
          strategyScores: { token_fuzzy: fuzzyScore },
          rawScore: maxSim,
          finalScore: fuzzyScore,
          relevanceExplanation: `تطابق تقريبي / تصحيح أخطاء إملائية مع "${matchedTarget}" بنسبة ${(maxSim * 100).toFixed(0)}%`,
          metadata: { entity, attributes: db.getAttributesForEntity(entity.id) }
        });
      }
    }

    return results;
  }
}
