import { supabase, isSupabaseConfigured } from '@/supabaseClient';

const LOCAL_SUMMARY_CACHE_KEY = '__app_summary_cache_v1__';

function getLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_SUMMARY_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalCache(key, data) {
  try {
    const cache = getLocalCache();
    cache[key] = data;
    localStorage.setItem(LOCAL_SUMMARY_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to save to local summary cache:', err);
  }
}

/**
 * Normalizes input text and generates a deterministic SHA-256 hash.
 */
export async function computeContentHash(rawText) {
  if (!rawText) return 'empty_content';
  const normalized = rawText
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ');

  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Web Crypto SHA-256 unavailable, using fallback hash:', err);
  }

  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) + normalized.charCodeAt(i);
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

export const summaryCacheService = {
  /**
   * Look up existing summary in Supabase or local cache
   */
  async getCachedSummary({ contentId, contentHash, language = 'ar' }) {
    if (!contentId || !contentHash) {
      return { found: false, summary: null };
    }

    const cacheKey = `${contentId}:${contentHash}:${language}`;

    // 1. Try Supabase lookup if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_summaries')
          .select('id, summary, model, language')
          .eq('content_id', contentId)
          .eq('content_hash', contentHash)
          .eq('language', language)
          .maybeSingle();

        if (!error && data && data.summary) {
          // Keep local cache in sync
          setLocalCache(cacheKey, { summary: data.summary, model: data.model || 'gemini' });
          return {
            found: true,
            summary: data.summary,
            model: data.model || 'gemini',
            fromCache: true
          };
        }
      } catch (err) {
        console.warn('Supabase content_summaries lookup error:', err);
      }
    }

    // 2. Local Storage fallback
    const local = getLocalCache();
    if (local[cacheKey] && local[cacheKey].summary) {
      return {
        found: true,
        summary: local[cacheKey].summary,
        model: local[cacheKey].model || 'gemini',
        fromCache: true
      };
    }

    return { found: false, summary: null };
  },

  /**
   * Save a newly generated summary to Supabase and local cache
   */
  async saveSummary({ contentId, contentHash, summary, language = 'ar', model = 'gemini-2.5-flash' }) {
    if (!contentId || !contentHash || !summary) {
      return false;
    }

    const cacheKey = `${contentId}:${contentHash}:${language}`;
    const payload = {
      content_id: contentId,
      content_hash: contentHash,
      summary: summary.trim(),
      language,
      model,
      updated_at: new Date().toISOString()
    };

    // Save locally
    setLocalCache(cacheKey, { summary: summary.trim(), model });

    // Save to Supabase with upsert handling on conflict (content_id, content_hash, language)
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('content_summaries')
          .upsert(payload, {
            onConflict: 'content_id,content_hash,language'
          });

        if (error) {
          console.error('Failed to save summary to Supabase content_summaries:', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Error saving summary to Supabase:', err);
        return false;
      }
    }

    return true;
  }
};
