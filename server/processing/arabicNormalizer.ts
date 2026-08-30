/**
 * Comprehensive Arabic Text Normalizer
 * Handles tatweel, tashkeel, hamza variations, taa marbuta/haa, alif maqsura,
 * numerals, punctuation, and colloquial normalization.
 */

// Arabic Diacritics Regex (Tashkeel: Fatha, Damma, Kasra, Tanwin, Sukun, Shaddah, Dagger Alif)
const TASHKEEL_REGEX = /[\u064B-\u065F\u0670]/g;

// Tatweel (Kashida)
const TATWEEL_REGEX = /\u0640/g;

// Eastern Arabic / Hindi Numerals Map
const ARABIC_INDIC_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

const DIGITS_REGEX = /[٠-٩]/g;

/**
 * Remove tashkeel / harakat from Arabic string
 */
export function removeTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(TASHKEEL_REGEX, '');
}

/**
 * Remove tatweel (kashida)
 */
export function removeTatweel(text: string): string {
  if (!text) return '';
  return text.replace(TATWEEL_REGEX, '');
}

/**
 * Convert Hindi/Eastern Arabic digits to Western digits
 */
export function normalizeDigits(text: string): string {
  if (!text) return '';
  return text.replace(DIGITS_REGEX, (d) => ARABIC_INDIC_DIGITS[d] || d);
}

/**
 * Normalize Alef forms: [أ إ آ ٱ] -> ا
 */
export function normalizeAlef(text: string): string {
  if (!text) return '';
  return text.replace(/[أإآٱ]/g, 'ا');
}

/**
 * Normalize Taa Marbuta (ة) -> ه or uniform token
 */
export function normalizeTaaMarbuta(text: string): string {
  if (!text) return '';
  return text.replace(/ة/g, 'ه');
}

/**
 * Normalize Alif Maqsura (ى) -> ي
 */
export function normalizeYaa(text: string): string {
  if (!text) return '';
  return text.replace(/ى/g, 'ي');
}

/**
 * Normalize Persian / Urdu character variations to standard Arabic
 */
export function normalizeForeignArabicChars(text: string): string {
  if (!text) return '';
  return text
    .replace(/ك/g, 'ك')
    .replace(/ک/g, 'ك')
    .replace(/ی/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و');
}

/**
 * Full Canonical Normalization for Search and Indexing
 * Produces a clean, punctuation-free, lowercase, normalized representation
 */
export function normalizeArabicText(text: string, options?: { preservePunctuation?: boolean }): string {
  if (!text || typeof text !== 'string') return '';

  let res = text.trim();

  // 1. Lowercase English portions
  res = res.toLowerCase();

  // 2. Remove Tatweel
  res = removeTatweel(res);

  // 3. Remove Tashkeel
  res = removeTashkeel(res);

  // 4. Normalize Alef forms
  res = normalizeAlef(res);

  // 5. Normalize Yaa & Alif Maqsura
  res = normalizeYaa(res);

  // 6. Normalize Taa Marbuta to Haa
  res = normalizeTaaMarbuta(res);

  // 7. Normalize digits
  res = normalizeDigits(res);

  // 8. Normalize foreign Arabic variants
  res = normalizeForeignArabicChars(res);

  // 8b. Collapse repeated characters (e.g. برووو -> برو, الترااا -> الترا)
  res = res.replace(/([^\d\s])\1{2,}/g, '$1');

  // 9. Clean punctuation & extra whitespace unless specifically preserved
  if (!options?.preservePunctuation) {
    // Replace punctuation with spaces
    res = res.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'؛،؟«»\[\]<>|\\\/+]/g, ' ');
  }

  // 10. Collapse multiple spaces
  res = res.replace(/\s+/g, ' ').trim();

  return res;
}

/**
 * Light normalization that preserves some formatting (useful for entity display comparison)
 */
export function lightNormalize(text: string): string {
  if (!text) return '';
  let res = text.trim().toLowerCase();
  res = removeTatweel(res);
  res = removeTashkeel(res);
  res = normalizeAlef(res);
  res = normalizeYaa(res);
  res = normalizeTaaMarbuta(res);
  res = normalizeDigits(res);
  return res.replace(/\s+/g, ' ').trim();
}
