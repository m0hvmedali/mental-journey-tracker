import { normalizeArabicText } from './arabicNormalizer';

export const ARABIC_STOP_WORDS = new Set([
  'في', 'من', 'إلى', 'الى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'تم', 'كان', 'كانت',
  'أو', 'او', 'أم', 'ام', 'ثم', 'حيث', 'أن', 'ان', 'إن', 'الذي', 'التي', 'الذين', 'اللاتي',
  'كل', 'بعض', 'غير', 'قد', 'بين', 'حول', 'خلال', 'نحو', 'فقط',
  'هو', 'هي', 'هم', 'هن', 'أنت', 'أنتما', 'أنتم', 'أنا', 'نحن',
  'ما', 'ماذا', 'متى', 'اين', 'أين', 'كيف', 'كم', 'هل', 'لماذا',
  'ده', 'دي', 'دا', 'ديه', 'دول', 'إيه', 'ايه', 'فين', 'امتى', 'ازاي',
  'طب', 'طيب', 'يا', 'لو', 'سمحت', 'فضلك', 'عايز', 'عاوز', 'ممكن'
].map(s => normalizeArabicText(s)));

/**
 * Tokenize string into normalized terms
 */
export function tokenize(text: string, filterStopWords: boolean = false): string[] {
  if (!text) return [];
  const normalized = normalizeArabicText(text);
  const rawTokens = normalized.split(/\s+/).filter(t => t.length > 0);

  if (!filterStopWords) {
    return rawTokens;
  }

  return rawTokens.filter(t => !ARABIC_STOP_WORDS.has(t));
}

/**
 * Generate N-grams (1-gram, 2-gram, 3-gram) for multi-word phrase matching
 */
export function generateNgrams(tokens: string[], maxN: number = 3): string[] {
  const ngrams: string[] = [];
  const n = tokens.length;

  for (let size = 1; size <= Math.min(maxN, n); size++) {
    for (let i = 0; i <= n - size; i++) {
      ngrams.push(tokens.slice(i, i + size).join(' '));
    }
  }

  return ngrams;
}

/**
 * Arabic Light Stemmer
 * Removes common prefixes (ال, و, ف, ب, ك, ل) and suffixes (ها, هم, هن, ون, ين, ات, ه, ية)
 */
export function lightStem(word: string): string {
  if (!word || word.length <= 3) return word;

  let stem = word;

  // Remove common prefixes
  if (stem.startsWith('ال') && stem.length > 4) {
    stem = stem.slice(2);
  } else if ((stem.startsWith('و') || stem.startsWith('ف') || stem.startsWith('ب') || stem.startsWith('ك') || stem.startsWith('ل')) && stem.length > 3) {
    stem = stem.slice(1);
  }

  // Remove common suffixes
  if ((stem.endsWith('ات') || stem.endsWith('ين') || stem.endsWith('ون') || stem.endsWith('ية') || stem.endsWith('ها') || stem.endsWith('هم')) && stem.length > 4) {
    stem = stem.slice(0, -2);
  } else if ((stem.endsWith('ه') || stem.endsWith('ي') || stem.endsWith('ك') || stem.endsWith('ت')) && stem.length > 3) {
    stem = stem.slice(0, -1);
  }

  return stem;
}

/**
 * Calculate Levenshtein Edit Distance
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Normalized string similarity score (0.0 to 1.0)
 */
export function stringSimilarity(strA: string, strB: string): number {
  const normA = normalizeArabicText(strA);
  const normB = normalizeArabicText(strB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  // Substring containment gives high boost
  if (normA.includes(normB) || normB.includes(normA)) {
    const minLen = Math.min(normA.length, normB.length);
    const maxLen = Math.max(normA.length, normB.length);
    return 0.85 + 0.15 * (minLen / maxLen);
  }

  const distance = levenshteinDistance(normA, normB);
  const maxLen = Math.max(normA.length, normB.length);

  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Jaccard Token Overlap Similarity (0.0 to 1.0)
 */
export function jaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}
