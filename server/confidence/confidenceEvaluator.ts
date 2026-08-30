import { SearchRetrievalOutput } from '../search/types';
import { ResolvedReference } from '../context/types';
import { getConfig } from '../config/chatbot.config';

export type ResponseType =
  | 'DIRECT_ANSWER'
  | 'CONTEXTUAL_ANSWER'
  | 'COMPARISON'
  | 'MULTI_RESULT'
  | 'CLARIFICATION'
  | 'LOW_CONFIDENCE'
  | 'NO_RESULT'
  | 'GREETING';

export interface ConfidenceEvaluation {
  searchConfidence: number;
  contextConfidence: number;
  overallConfidence: number;
  responseType: ResponseType;
  clarificationOptions?: string[];
  reason: string;
}

export class ConfidenceEvaluator {
  public static evaluate(
    retrieval: SearchRetrievalOutput,
    resolution: ResolvedReference,
    intent: string
  ): ConfidenceEvaluation {
    const config = getConfig().search;
    const highThreshold = config.highConfidenceThreshold || 0.80;
    const minThreshold = config.minConfidenceThreshold || 0.45;
    const clarifyThreshold = config.clarificationThreshold || 0.65;

    // 1. Handle Greetings immediately
    if (intent === 'GREETING') {
      return {
        searchConfidence: 1.0,
        contextConfidence: 1.0,
        overallConfidence: 1.0,
        responseType: 'GREETING',
        reason: 'تحية ترحيبية'
      };
    }

    // 2. Handle Comparison
    if (intent === 'COMPARISON') {
      const entityResults = retrieval.results.filter(r => r.type === 'entity' || (r.data && r.data.entityName));
      if (entityResults.length >= 2) {
        return {
          searchConfidence: 0.92,
          contextConfidence: 0.90,
          overallConfidence: 0.91,
          responseType: 'COMPARISON',
          reason: 'طلب مقارنة بين كيانين أو أكثر متوفرين في قاعدة المعرفة'
        };
      }
    }

    const results = retrieval.results;
    const searchConf = retrieval.searchConfidence;

    // Calculate context confidence
    let contextConf = 0.5;
    if (resolution.hasReference) {
      contextConf = 0.90;
    } else if (retrieval.contextUsed.activeEntityIds.length > 0) {
      contextConf = 0.75;
    } else {
      contextConf = 0.60;
    }

    // If search found zero results or very low confidence, context alone cannot create high confidence
    const overallConfidence = searchConf < 0.35 
      ? Number(searchConf.toFixed(3)) 
      : Number((searchConf * 0.75 + contextConf * 0.25).toFixed(3));

    // Case: No results found or confidence below floor
    if (results.length === 0 || searchConf < minThreshold || overallConfidence < minThreshold) {
      return {
        searchConfidence: searchConf,
        contextConfidence: contextConf,
        overallConfidence: overallConfidence,
        responseType: 'NO_RESULT',
        reason: 'لم يتم العثور على أي بيانات مطابقة في قاعدة المعرفة المعتمدة'
      };
    }

    // Case: Multiple close candidates with ambiguous top separation (Only when candidates are genuinely relevant!)
    if (results.length >= 2) {
      const top1 = results[0];
      const top2 = results[1];
      const scoreDiff = Math.abs(top1.score - top2.score);

      // Only trigger CLARIFICATION if top1 actually meets the clarifyThreshold (i.e. not two random low-score candidates)
      if (top1.score >= clarifyThreshold && scoreDiff < 0.08 && top1.score < 0.88 && top1.title !== top2.title) {
        return {
          searchConfidence: searchConf,
          contextConfidence: contextConf,
          overallConfidence: overallConfidence,
          responseType: 'CLARIFICATION',
          clarificationOptions: [top1.title, top2.title],
          reason: `تطابق متقارب بين خيارين (${top1.title} و ${top2.title}) - يتطلب توضيحًا من المستخدم`
        };
      }
    }

    // Case: High Confidence Match
    if (overallConfidence >= highThreshold) {
      if (resolution.hasReference) {
        return {
          searchConfidence: searchConf,
          contextConfidence: contextConf,
          overallConfidence: overallConfidence,
          responseType: 'CONTEXTUAL_ANSWER',
          reason: 'تطابق عالي الثقة مدعوم بالسياق'
        };
      }
      return {
        searchConfidence: searchConf,
        contextConfidence: contextConf,
        overallConfidence: overallConfidence,
        responseType: 'DIRECT_ANSWER',
        reason: 'تطابق مباشر قوي مع البيانات الموثقة'
      };
    }

    // Case: Medium-Low Confidence
    if (overallConfidence >= clarifyThreshold) {
      return {
        searchConfidence: searchConf,
        contextConfidence: contextConf,
        overallConfidence: overallConfidence,
        responseType: 'DIRECT_ANSWER',
        reason: 'تطابق مقبول مع البيانات المتاحة'
      };
    }

    return {
      searchConfidence: searchConf,
      contextConfidence: contextConf,
      overallConfidence: overallConfidence,
      responseType: 'LOW_CONFIDENCE',
      reason: 'نسبة التطابق منخفضة ولا تفي بالحد الأدنى للثقة المباشرة'
    };
  }
}
