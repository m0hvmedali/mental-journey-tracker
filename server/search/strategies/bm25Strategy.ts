import { SearchStrategy, SearchQuery, CandidateResult } from '../types';
import { db } from '../../database/memoryStore';
import { tokenize } from '../../processing/tokenizer';
import { getConfig } from '../../config/chatbot.config';

interface BM25Doc {
  id: string;
  type: 'document' | 'entity' | 'fact';
  title: string;
  entityId?: string;
  tokens: string[];
  length: number;
  rawObject: any;
}

export class BM25Strategy implements SearchStrategy {
  name = 'bm25';
  weight = 0.80;

  public search(query: SearchQuery): CandidateResult[] {
    const config = getConfig().search.bm25;
    const k1 = config.k1 || 1.5;
    const b = config.b || 0.75;

    const queryTokens = query.tokens.length > 0 ? query.tokens : tokenize(query.rawQuery, true);
    if (queryTokens.length === 0) return [];

    // 1. Build document corpus
    const corpus: BM25Doc[] = [];

    // Documents
    for (const doc of db.getAllDocuments()) {
      const tokens = tokenize(`${doc.title} ${doc.content}`, true);
      corpus.push({
        id: doc.id,
        type: 'document',
        title: doc.title,
        tokens,
        length: tokens.length,
        rawObject: doc
      });
    }

    // Entities
    for (const ent of db.getAllEntities()) {
      const attrs = db.getAttributesForEntity(ent.id);
      const attrText = attrs.map(a => `${a.key} ${String(a.value)} ${a.unit || ''} ${a.aliases.join(' ')}`).join(' ');
      const tokens = tokenize(`${ent.name} ${ent.aliases.join(' ')} ${ent.description || ''} ${attrText}`, true);
      corpus.push({
        id: ent.id,
        type: 'entity',
        title: ent.name,
        entityId: ent.id,
        tokens,
        length: tokens.length,
        rawObject: ent
      });
    }

    // Facts
    for (const fact of db.getAllFacts()) {
      const tokens = tokenize(`${fact.subject} ${fact.predicate} ${fact.object} ${fact.rawText}`, true);
      corpus.push({
        id: fact.id,
        type: 'fact',
        title: `${fact.subject} - ${fact.predicate}`,
        tokens,
        length: tokens.length,
        rawObject: fact
      });
    }

    const N = corpus.length;
    if (N === 0) return [];

    // Average Document Length
    const avgdl = corpus.reduce((acc, d) => acc + d.length, 0) / N;

    // Document frequency n(q)
    const docFrequency: Map<string, number> = new Map();
    for (const token of queryTokens) {
      let count = 0;
      for (const doc of corpus) {
        if (doc.tokens.includes(token)) count++;
      }
      docFrequency.set(token, count);
    }

    // Calculate BM25 scores
    const scoredDocs: Array<{ doc: BM25Doc; score: number; rawScore: number }> = [];

    for (const doc of corpus) {
      let docScore = 0;
      let matchedCount = 0;

      // Term frequencies in current doc
      const tfMap: Map<string, number> = new Map();
      for (const t of doc.tokens) {
        tfMap.set(t, (tfMap.get(t) || 0) + 1);
      }

      for (const qToken of queryTokens) {
        const n_q = docFrequency.get(qToken) || 0;
        if (n_q === 0) continue;

        // IDF with smoothing: ln(1 + (N - n_q + 0.5) / (n_q + 0.5))
        const idf = Math.log(1 + (N - n_q + 0.5) / (n_q + 0.5));
        const tf = tfMap.get(qToken) || 0;

        if (tf > 0) {
          matchedCount++;
          const numerator = tf * (k1 + 1);
          const denominator = tf + k1 * (1 - b + b * (doc.length / (avgdl || 1)));
          docScore += idf * (numerator / denominator);
        }
      }

      if (docScore > 0.3 && matchedCount > 0) {
        const coverageRatio = matchedCount / queryTokens.length;
        const normalized = Math.min(0.95, (docScore / (docScore + 1.5)) * (0.35 + 0.65 * coverageRatio));
        if (normalized >= 0.40) {
          scoredDocs.push({ doc, score: normalized, rawScore: docScore });
        }
      }
    }

    if (scoredDocs.length === 0) return [];

    return scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ doc, score, rawScore }) => {
        return {
          id: `bm25_${doc.type}_${doc.id}`,
          type: doc.type,
          title: doc.title,
          entityId: doc.entityId,
          entityName: doc.type === 'entity' ? doc.title : undefined,
          matchedText: doc.tokens.slice(0, 20).join(' '),
          strategyScores: { bm25: score },
          rawScore: rawScore,
          finalScore: score,
          relevanceExplanation: `تصنيف BM25 (درجة التطابق الإحصائي: ${score.toFixed(2)})`,
          metadata: { rawObject: doc.rawObject }
        };
      });
  }
}
