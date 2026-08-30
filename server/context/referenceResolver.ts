import { db } from '../database/memoryStore';
import { normalizeArabicText } from '../processing/arabicNormalizer';
import { detectRequestedAttribute } from '../processing/dialectMapper';
import { ResolvedReference, ConversationContextState } from './types';

export class ReferenceResolver {
  /**
   * Resolve anaphoric references, pronouns, and ellipsis given the conversation state
   */
  public static resolve(rawQuery: string, state: ConversationContextState): ResolvedReference {
    const norm = normalizeArabicText(rawQuery);
    const activeEntities = state.activeEntityIds.map(id => db.getEntity(id)!).filter(Boolean);
    const primaryActiveEntity = activeEntities.length > 0 ? activeEntities[0] : null;

    if (!primaryActiveEntity) {
      return {
        hasReference: false,
        resolvedQuery: rawQuery,
        appliedEntityIds: [],
        referenceType: 'none',
        explanation: 'لا توجد كيانات سابقة في السياق'
      };
    }

    // Check if query already explicitly mentions the active entity or another known entity
    const directMention = db.getAllEntities().some(e => {
      if (e.normalizedName.length < 3) return false;
      return norm.includes(e.normalizedName) || e.normalizedAliases.some(a => a.length >= 3 && norm.includes(a));
    });

    const attrDetection = detectRequestedAttribute(norm);
    const words = norm.split(/\s+/).filter(Boolean);
    const isShortQuery = words.length <= 5;

    // --- PATTERN 1: Pronoun / Implicit Entity Reference (e.g. "مين مؤسسه؟", "مين مؤلفه؟", "بيفيد في ايه؟", "اعراضه ايه؟", "هو عبارة عن ايه؟") ---
    const pronounRegex = /(^|\s)(ده|دي|ديه|دا|هو|هي|دول|هذا|هذه|ذلك|تلك|عنه|عنها|فيه|فيها|به|بها|منه|منها)(\s|$)/i;
    const hasExplicitPronoun = pronounRegex.test(norm);
    const hasImpliedPronoun = 
      norm.includes('موسس') || norm.includes('مؤسس') || norm.includes('مولف') || norm.includes('مؤلف') ||
      norm.includes('اعراض') || norm.includes('شروط') || norm.includes('فلسف') || norm.includes('فنيات') ||
      norm.includes('تقنيات') || norm.includes('علاج') || norm.includes('اهداف') || norm.includes('مدت');

    if ((hasExplicitPronoun || hasImpliedPronoun || attrDetection.attribute) && isShortQuery && !directMention) {
      const resolved = `${rawQuery} ${primaryActiveEntity.name}`.trim();

      return {
        hasReference: true,
        resolvedQuery: resolved,
        appliedEntityIds: [primaryActiveEntity.id],
        referenceType: hasExplicitPronoun ? 'pronoun' : 'attribute_ellipsis',
        explanation: `تم إلحاق الاستفسار بالكيان النشط في السياق (${primaryActiveEntity.name})`
      };
    }

    // --- PATTERN 2: Followup / Ellipsis prefix (e.g. "طب والأعراض؟", "والفلسفة؟", "ونقاط القطع؟", "ومدته كام؟") ---
    const startsWithFollowup = norm.startsWith('و') || norm.startsWith('طب ') || norm.startsWith('طيب ');
    if (startsWithFollowup && isShortQuery && !directMention) {
      const resolved = `${rawQuery} ${primaryActiveEntity.name}`.trim();
      return {
        hasReference: true,
        resolvedQuery: resolved,
        appliedEntityIds: [primaryActiveEntity.id],
        referenceType: 'attribute_ellipsis',
        explanation: `تم ربط المتابعة بالكيان الحالي (${primaryActiveEntity.name})`
      };
    }

    // Default: No explicit reference modification
    return {
      hasReference: false,
      resolvedQuery: rawQuery,
      appliedEntityIds: [],
      referenceType: 'none',
      explanation: 'استفسار مستقل'
    };
  }
}
