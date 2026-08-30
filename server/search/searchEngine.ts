import { SearchStrategy, SearchQuery, SearchRetrievalOutput } from './types';
import { ExactStrategy } from './strategies/exactStrategy';
import { NormalizedStrategy } from './strategies/normalizedStrategy';
import { BM25Strategy } from './strategies/bm25Strategy';
import { TokenFuzzyStrategy } from './strategies/tokenFuzzyStrategy';
import { SynonymStrategy } from './strategies/synonymStrategy';
import { EntityStrategy } from './strategies/entityStrategy';
import { ContextStrategy } from './strategies/contextStrategy';
import { SearchRanker } from './ranker';
import { normalizeArabicText } from '../processing/arabicNormalizer';
import { tokenize } from '../processing/tokenizer';
import { detectRequestedAttribute } from '../processing/dialectMapper';
import { getConfig } from '../config/chatbot.config';

export class SearchEngine {
  private strategies: SearchStrategy[] = [];

  constructor() {
    // Register default strategies (Extensible architecture: strategies can be added at runtime)
    this.strategies.push(
      new ExactStrategy(),
      new NormalizedStrategy(),
      new SynonymStrategy(),
      new EntityStrategy(),
      new BM25Strategy(),
      new TokenFuzzyStrategy(),
      new ContextStrategy()
    );
  }

  /**
   * Register a new search strategy dynamically without rewriting the engine
   */
  public registerStrategy(strategy: SearchStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Perform comprehensive multi-strategy search
   */
  public async search(rawQuery: string, options?: {
    contextEntityIds?: string[];
    detectedEntities?: string[];
    conversationId?: string;
    limit?: number;
    intent?: string;
    resolvedQuery?: string;
  }): Promise<SearchRetrievalOutput> {
    const config = getConfig().search;
    const maxResults = options?.limit || config.maxResults || 5;

    const effectiveQuery = options?.resolvedQuery || rawQuery;
    const normalizedQuery = normalizeArabicText(effectiveQuery);
    const tokens = tokenize(normalizedQuery, false);
    const attrDetection = detectRequestedAttribute(normalizedQuery);

    const searchQuery: SearchQuery = {
      rawQuery: effectiveQuery,
      normalizedQuery,
      tokens,
      requestedAttribute: attrDetection.attribute,
      detectedEntities: options?.detectedEntities || [],
      contextEntityIds: options?.contextEntityIds || [],
      conversationId: options?.conversationId,
      limit: maxResults
    };

    // Execute all strategies
    const allCandidates = [];
    for (const strategy of this.strategies) {
      try {
        const results = await strategy.search(searchQuery);
        allCandidates.push(...results);
      } catch (err) {
        console.error(`Error in search strategy ${strategy.name}:`, err);
      }
    }

    // Rank, deduplicate & filter
    const rankedResults = SearchRanker.rank(allCandidates);
    const topResults = rankedResults.slice(0, maxResults);

    // Compute search confidence
    let searchConfidence = 0;
    if (topResults.length > 0) {
      const topScore = topResults[0].finalScore;
      const secondScore = topResults.length > 1 ? topResults[1].finalScore : 0;
      // High score with separation provides peak confidence
      searchConfidence = Number(topScore.toFixed(3));
    }

    const structuredResults = topResults.map(r => ({
      id: r.id,
      type: r.type,
      score: r.finalScore,
      title: r.title,
      data: {
        entityName: r.entityName,
        attributeKey: r.attributeKey,
        attributeValue: r.attributeValue,
        unit: r.unit,
        matchedText: r.matchedText,
        metadata: r.metadata
      },
      explanation: r.relevanceExplanation
    }));

    return {
      query: rawQuery,
      normalizedQuery,
      intent: options?.intent || 'QUERY_INFO',
      detectedEntities: options?.detectedEntities || [],
      requestedAttribute: attrDetection.attribute,
      searchConfidence,
      results: structuredResults,
      contextUsed: {
        activeEntityIds: options?.contextEntityIds || [],
        resolvedQuery: options?.resolvedQuery
      }
    };
  }
}

// Global Singleton Search Engine
export const searchEngine = new SearchEngine();
