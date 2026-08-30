import { normalizeArabicText } from '../processing/arabicNormalizer';
import { COMPARISON_KEYWORDS, detectRequestedAttribute } from '../processing/dialectMapper';

export type UserIntent =
  | 'QUERY_PRICE'
  | 'QUERY_ATTRIBUTE'
  | 'QUERY_ENTITY'
  | 'COMPARISON'
  | 'GREETING'
  | 'FOLLOW_UP'
  | 'OUT_OF_SCOPE'
  | 'UNKNOWN';

const GREETINGS = [
  'اهلا', 'مرحبا', 'السلام عليكم', 'سلام', 'صباح الخير', 'مساء الخير', 'ازيك', 'عامل ايه', 'هاي', 'hello', 'hi'
];

export class IntentClassifier {
  public static classify(query: string, contextHasEntities: boolean): { intent: UserIntent; confidence: number; detectedAttribute: string | null } {
    const norm = normalizeArabicText(query);
    if (!norm) return { intent: 'UNKNOWN', confidence: 0.0, detectedAttribute: null };

    // 1. Check Greeting
    for (const g of GREETINGS) {
      const gNorm = normalizeArabicText(g);
      if (norm === gNorm || norm.startsWith(gNorm + ' ')) {
        return { intent: 'GREETING', confidence: 0.95, detectedAttribute: null };
      }
    }

    // 2. Check Comparison
    for (const comp of COMPARISON_KEYWORDS) {
      const compNorm = normalizeArabicText(comp);
      if (norm.includes(compNorm)) {
        return { intent: 'COMPARISON', confidence: 0.92, detectedAttribute: null };
      }
    }

    // 3. Check Attribute / Price Detection
    const attrResult = detectRequestedAttribute(norm);
    if (attrResult.attribute) {
      if (attrResult.attribute === 'price') {
        return { intent: 'QUERY_PRICE', confidence: attrResult.confidence, detectedAttribute: 'price' };
      }
      return { intent: 'QUERY_ATTRIBUTE', confidence: attrResult.confidence, detectedAttribute: attrResult.attribute };
    }

    // 4. Check Follow-Up Indicators
    const isShort = norm.split(/\s+/).length <= 3;
    const hasFollowUpPrefix = norm.startsWith('طب ') || norm.startsWith('طيب ') || norm.startsWith('و') || norm.includes('البرو') || norm.includes('الماكس');
    if ((isShort || hasFollowUpPrefix) && contextHasEntities) {
      return { intent: 'FOLLOW_UP', confidence: 0.85, detectedAttribute: null };
    }

    return { intent: 'QUERY_ENTITY', confidence: 0.70, detectedAttribute: null };
  }
}
