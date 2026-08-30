import { CandidateResult } from './types';
import { getConfig } from '../config/chatbot.config';

export class SearchRanker {
  /**
   * Aggregate, deduplicate, weight, and rank candidate results
   */
  public static rank(candidates: CandidateResult[]): CandidateResult[] {
    const config = getConfig().search;
    const weights = config.weights;
    const minThreshold = config.minConfidenceThreshold;

    // Group candidates by logical key (e.g. entityId or docId or attributeId)
    const grouped: Map<string, CandidateResult> = new Map();

    for (const cand of candidates) {
      const dedupeKey = cand.attributeKey && cand.entityId
        ? `attr_${cand.entityId}_${cand.attributeKey}`
        : cand.entityId
          ? `ent_${cand.entityId}`
          : cand.id;

      if (!grouped.has(dedupeKey)) {
        grouped.set(dedupeKey, { ...cand, strategyScores: { ...cand.strategyScores } });
      } else {
        const existing = grouped.get(dedupeKey)!;
        // Merge strategy scores
        existing.strategyScores = { ...existing.strategyScores, ...cand.strategyScores };

        // Take higher base score or combine
        existing.rawScore = Math.max(existing.rawScore, cand.rawScore);
        if (cand.relevanceExplanation && !existing.relevanceExplanation.includes(cand.relevanceExplanation)) {
          existing.relevanceExplanation += ` | ${cand.relevanceExplanation}`;
        }
      }
    }

    const aggregated: CandidateResult[] = [];

    for (const cand of grouped.values()) {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const [strat, score] of Object.entries(cand.strategyScores)) {
        const weight = (weights as any)[strat] || (weights as any)[strat.replace('_match', 'Match')] || 0.8;
        weightedSum += score * weight;
        totalWeight += weight;
      }

      // Multi-strategy agreement bonus
      const strategyCount = Object.keys(cand.strategyScores).length;
      const multiBonus = strategyCount > 1 ? Math.min(0.12, (strategyCount - 1) * 0.04) : 0;

      const baseScore = totalWeight > 0 ? weightedSum / totalWeight : cand.rawScore;
      const finalScore = Math.min(1.0, Number((baseScore + multiBonus).toFixed(3)));

      if (finalScore >= minThreshold) {
        aggregated.push({
          ...cand,
          finalScore
        });
      }
    }

    // Sort descending by finalScore
    return aggregated.sort((a, b) => b.finalScore - a.finalScore);
  }
}
