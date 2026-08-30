import { normalizeArabicText } from './arabicNormalizer';

export interface DialectMapping {
  canonicalIntent: string;
  targetAttribute?: string;
  synonyms: string[];
  normalizedSynonyms: string[];
}

export const ATTRIBUTE_SYNONYMS: Record<string, string[]> = {
  founder: [
    'مؤسس', 'مؤسسه', 'مؤسسها', 'مؤسسين', 'المؤسس', 'مين اسسه', 'مين اسسها', 'مين اسسهم', 'مين عمله', 'مين عملها',
    'مؤلف', 'مؤلفه', 'مؤلفها', 'المؤلف', 'صاحبها', 'صاحبه', 'مكتشف', 'مبتكر', 'مين اخترعه', 'مين وضعه', 'واضع النظرية',
    'موسس', 'موسسه', 'موسسها', 'مولف', 'مولفه', 'مولفها'
  ],
  definition: [
    'ايه هو', 'ما هو', 'يعني ايه', 'تعريف', 'مفهوم', 'شرح', 'عرف', 'ايه هي', 'ما هي', 'هو ايه', 'عبارة عن ايه',
    'معنى', 'ما معنى', 'ما هو مفهوم'
  ],
  symptoms: [
    'اعراض', 'الاعراض', 'اعراضه', 'اعراضها', 'علامات', 'العلامات', 'سمات', 'السمات', 'مظاهر', 'المظاهر',
    'ازاي اعرف', 'شكله ايه', 'تشخيص'
  ],
  techniques: [
    'تقنيات', 'التقنيات', 'فنيات', 'الفنيات', 'تقنياته', 'تقنياتها', 'فنياته', 'فنياتها', 'اساليب', 'الاساليب',
    'تمارين', 'التمارين', 'ادوات', 'الادوات', 'طريقة العلاج', 'ازاي بيتعالج', 'بيتعالج ازاي'
  ],
  duration: [
    'مدة', 'المدة', 'مدته', 'مدتها', 'كام جلسة', 'عدد الجلسات', 'كام شهر', 'كام اسبوع', 'بياخد وقت قد ايه',
    'الوقت المستغرق', 'طول العلاج'
  ],
  philosophy: [
    'فلسفة', 'الفلسفة', 'فلسفته', 'فلسفتها', 'الاساس النظري', 'النموذج', 'الافتراض', 'الافتراضات', 'الرؤية',
    'مبدأ', 'المبادئ'
  ],
  cutoffs: [
    'نقاط القطع', 'نقطة القطع', 'الدرجات', 'الدرجة', 'التفسير', 'درجات', 'طريقة التصحيح', 'حساب الدرجة',
    'النتيجة', 'تفسير الدرجات'
  ],
  goals: [
    'اهداف', 'الاهداف', 'هدفه', 'هدفها', 'بيفيد في ايه', 'بيساعد على ايه', 'الفائدة', 'الفوائد', 'دواعي الاستعمال'
  ]
};

// Dialect filler words to strip when focusing on core query terms
export const COLLOQUIAL_FILLERS = [
  'لو سمحت', 'من فضلك', 'عايز اعرف', 'ممكن تقولي', 'ممكن اعرف', 'يا ترى',
  'هو', 'هي', 'طب', 'طيب', 'قولي', 'بقولك', 'معلش', 'حضرتك', 'يا ريت',
  'عاوز اعرف', 'بدور على', 'عايزة اعرف', 'عاوزة اعرف', 'عايز اسال', 'عاوز اسال'
];

export const CONTEXT_PRONOUNS = [
  'ده', 'دا', 'دي', 'ديه', 'هو', 'هي', 'دول', 'هذا', 'هذه', 'ذلك', 'تلك', 'هؤلاء',
  'اللي بعده', 'التاني', 'التانية', 'عنه', 'عنها', 'فيه', 'فيها', 'به', 'بها'
];

export const COMPARISON_KEYWORDS = [
  'قارن', 'مقارنة', 'الفرق بين', 'مين احسن', 'مين افضل', 'ايه الفرق', 'ولا', 'ولا ده', 'افضل من', 'ولا دا', 'الفرق'
];

// Pre-normalize all synonym lists for high-speed matching
export const NORMALIZED_ATTRIBUTE_MAP = new Map<string, string>();

for (const [attr, synonyms] of Object.entries(ATTRIBUTE_SYNONYMS)) {
  for (const syn of synonyms) {
    NORMALIZED_ATTRIBUTE_MAP.set(normalizeArabicText(syn), attr);
  }
}

/**
 * Detect requested attribute from query (e.g. founder, symptoms, techniques, duration)
 */
export function detectRequestedAttribute(normalizedQuery: string): { attribute: string | null; confidence: number } {
  // Check exact phrases first
  for (const [synNormalized, attr] of NORMALIZED_ATTRIBUTE_MAP.entries()) {
    if (normalizedQuery === synNormalized || normalizedQuery === `و${synNormalized}`) {
      return { attribute: attr, confidence: 1.0 };
    }
  }

  // Check substring contains with optional leading 'و'
  for (const [synNormalized, attr] of NORMALIZED_ATTRIBUTE_MAP.entries()) {
    const regex = new RegExp(`(^|\\s)(?:و)?${synNormalized}(\\s|$)`, 'i');
    if (regex.test(normalizedQuery)) {
      return { attribute: attr, confidence: 0.92 };
    }
  }

  return { attribute: null, confidence: 0.0 };
}

/**
 * Strip colloquial conversational fillers while keeping the core semantic question
 */
export function cleanColloquialFillers(text: string): string {
  let cleaned = text;
  for (const filler of COLLOQUIAL_FILLERS) {
    const normFiller = normalizeArabicText(filler);
    cleaned = cleaned.replace(new RegExp(`(^|\\s)${normFiller}(\\s|$)`, 'gi'), ' ');
  }
  return cleaned.trim();
}
