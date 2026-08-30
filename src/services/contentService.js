// src/services/contentService.js
/**
 * ============================================================================
 * CONTENT SERVICE LAYER (Single Source of Truth for CMS Content)
 * ============================================================================
 * Provides an abstracted API for fetching, searching, and managing psychological
 * content, modules, locations, references, blocks, emotions encyclopedia,
 * and clinical psychology insights.
 *
 * Architecture Rule: React UI Components MUST NEVER call Supabase directly for CMS content.
 * Flow: React UI -> contentService -> (Cache / Resilience Layer) -> Supabase PostgreSQL
 */

import { supabase, isSupabaseConfigured } from '../supabaseClient';
import emotionsFallback from '../data/emotions_details.json';
import { MODULES_DATA } from '../data/modulesData.js';

// In-memory cache for fast repeated accesses and offline/fallback resilience
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// LOCAL FALLBACK DATA (For local development or offline preview resilience)
// ============================================================================
const LOCAL_FALLBACK_CONTENT = {
  'thinking-errors': {
    id: '55555555-5555-5555-5555-555555555551',
    translation_group_id: '66666666-6666-6666-6666-666666666661',
    slug: 'thinking-errors',
    language: 'ar',
    title: 'التشوهات المعرفية (Thinking Errors)',
    description: 'دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها وفق أساليب العلاج المعرفي السلوكي (CBT).',
    content_type: 'scientific_page',
    status: 'published',
    markdown_content: `
# دليل التشوهات المعرفية (Cognitive Distortions)

التشوهات المعرفية هي أنماط تفكير تلقائية غير عقلانية تجعلنا نرى الواقع بصورة مشوهة أو متطرفة. تحدث هذه الأفكار في أجزاء من الثانية وتؤدي مباشرة إلى مشاعر سلبية حادة مثل القلق، الحزن، الذنب، أو الإحباط.

:::note
**ملاحظة إكلينيكية:**
الهدف من رصد التشوهات المعرفية ليس منع الأفكار من الظهور، بل التراجع خطوة للخلف وملاحظتها كأفكار عابرة وليست حقائق قاطعة.
:::

## 1. التفكير بالأبيض والأسود (All-or-Nothing Thinking)
رؤية الأمور في قطبين متطرفين دون أي مساحات رمادية: إما أن يكون العمل متكاملاً 100% أو يعتبر فاشلاً تماماً.

## 2. التعميم المفرط (Overgeneralization)
أخذ حدث سلبي منفرد وتعميمه على الحياة كلها واستخدام كلمات مثل *"دائماً"* أو *"أبداً"*.

## 3. التصفية الذهنية (Mental Filter)
التركيز فقط على التفاصيل السلبية وتجاهل كل الجوانب الإيجابية المحيطة بالموقف.

## 4. القفز إلى الاستنتاجات والتنبؤ الكارثي (Catastrophizing & Fortune Telling)
توقع أسوأ السيناريوهات وتصديق أنها ستقع حتماً، مع التقليل من قدرتك الذاتية على المواجهة.
    `,
    plain_text: 'دليل التشوهات المعرفية. التفكير بالأبيض والأسود، التعميم المفرط، التصفية الذهنية، والتنبؤ الكارثي.',
    css: '.content-callout { border-left: 4px solid var(--color-primary); }',
    metadata: {
      framework: 'CBT',
      reading_time_minutes: 6,
      difficulty: 'متوسط',
      author: 'فريق التحرير العلمي'
    },
    featured_image: '/article-by3DYy7JylaR.webp',
    published_at: '2026-08-30T00:00:00.000Z',
    content_blocks: [
      {
        id: 'block-1',
        block_type: 'markdown',
        position: 1,
        payload: {
          content: '### تمرين تفاعلي موجه: سجل الأفكار المعرفية\nاستخدم الأداة أدناه لتطبيق مهارات إعادة الهيكلة المعرفية على فكرة تراودك حالياً:'
        }
      },
      {
        id: 'block-2',
        block_type: 'interactive_component',
        position: 2,
        payload: {
          component: 'thought-record-wizard',
          props: {
            initialDistortion: 'allOrNothing',
            mode: 'guided'
          }
        },
        metadata: {
          title: 'معالج رصد وتفنيد الفكرة التلقائية'
        }
      },
      {
        id: 'block-3',
        block_type: 'interactive_component',
        position: 3,
        payload: {
          component: 'distortion-quiz',
          props: {}
        },
        metadata: {
          title: 'اختبار تشخيص التشوهات المعرفية'
        }
      }
    ],
    scientific_references: [
      {
        id: 'ref-1',
        title: 'Cognitive Therapy of Depression',
        authors: 'Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G.',
        year: 1979,
        publication: 'Guilford Press',
        url: 'https://guilford.com'
      },
      {
        id: 'ref-2',
        title: 'Feeling Good: The New Mood Therapy',
        authors: 'Burns, D. D.',
        year: 1999,
        publication: 'HarperCollins',
        url: 'https://goodreads.com'
      }
    ],
    tags: [
      { id: 'tag-1', name: 'العلاج المعرفي السلوكي', slug: 'cbt' },
      { id: 'tag-2', name: 'إعادة الهيكلة المعرفية', slug: 'cognitive-restructuring' }
    ],
    related_content: []
  },
  'defense-mechanisms': {
    id: '55555555-5555-5555-5555-555555555552',
    translation_group_id: '66666666-6666-6666-6666-666666666662',
    slug: 'defense-mechanisms',
    language: 'ar',
    title: 'آليات الدفاع النفسي (Defense Mechanisms)',
    description: 'دليل شامل لآليات الدفاع النفسي اللاشعورية من منظور التحليل النفسي وسيكولوجيا الأنا.',
    content_type: 'scientific_page',
    status: 'published',
    markdown_content: `
# آليات الدفاع النفسي (Ego Defense Mechanisms)

آليات الدفاع النفسي هي استراتيجيات نفسية لاشعورية يستخدمها العقل لحماية الذات من القلق والتهديدات النفسية والصراعات الداخلية.

## تصنيف آليات الدفاع:
1. **الدفاعات الناضجة:** التسامي، الفكاهة، الإيثار.
2. **الدفاعات العصابية:** الكبت، التبرير، الإزاحة.
3. **الدفاعات غير الناضجة:** الإسقاط، الإنكار، الانشطار.
    `,
    metadata: { framework: 'Psychodynamic', reading_time_minutes: 8 },
    featured_image: '/DfenssImg/hero.webp',
    published_at: '2026-08-30T00:00:00.000Z',
    content_blocks: [],
    scientific_references: [],
    tags: [{ id: 'tag-3', name: 'التحليل النفسي', slug: 'psychodynamic' }],
    related_content: []
  },
  'tolerance-window': {
    id: '55555555-5555-5555-5555-555555555553',
    translation_group_id: '66666666-6666-6666-6666-666666666663',
    slug: 'tolerance-window',
    language: 'ar',
    title: 'نافذة التحمل العصبي (Window of Tolerance)',
    description: 'فهم السعة المثلى للجهاز العصبي لتنظيم المشاعر وكيفية التعامل مع حالات فرط الاستثارة وانخفاض الاستثارة.',
    content_type: 'scientific_page',
    status: 'published',
    markdown_content: `
# نافذة التحمل العصبي (Window of Tolerance)

مفهوم وضعه د. دان سيغل لوصف النطاق الفسيولوجي والعاطفي الذي نستطيع فيه استقبال الضغوط اليومية والتفاعل معها بمرونة وتوازن.
    `,
    metadata: { framework: 'Somatic / Polyvagal', reading_time_minutes: 6 },
    featured_image: '/window-of-tolerance.webp',
    published_at: '2026-08-30T00:00:00.000Z',
    content_blocks: [
      {
        id: 'block-tw-1',
        block_type: 'interactive_component',
        position: 1,
        payload: { component: 'breathing-circle', props: { mode: '4-7-8' } },
        metadata: { title: 'تمرين التنفس لإعادة التوازن العصبي' }
      }
    ],
    scientific_references: [],
    tags: [{ id: 'tag-4', name: 'تنظيم المشاعر', slug: 'emotional-regulation' }],
    related_content: []
  },
  'about': {
    id: '55555555-5555-5555-5555-555555555554',
    translation_group_id: '66666666-6666-6666-6666-666666666664',
    slug: 'about',
    language: 'ar',
    title: 'عن منصة الوعي والتعافي النفسي',
    description: 'الرؤية العلمية، الأهداف السريرية، وميثاق الأمان والخصوصية للمنصة.',
    content_type: 'about',
    status: 'published',
    markdown_content: `
# عن المنصة
منصة تفاعلية مبنية على أحدث الأدلة والبراهين السريرية المعتمدة في علم النفس الإكلينيكي والعلاج المعرفي السلوكي الحديث.
    `,
    metadata: { framework: 'Clinical Psychology', reading_time_minutes: 4 },
    featured_image: '/about-hero.webp',
    published_at: '2026-08-30T00:00:00.000Z',
    content_blocks: [],
    scientific_references: [],
    tags: [],
    related_content: []
  }
};

export const contentService = {
  /**
   * 1. Get published content by unique slug and language
   */
  async getContentBySlug(slug, language = 'ar') {
    const cacheKey = `content_slug_${slug}_${language}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content')
          .select(`
            *,
            content_blocks (*),
            content_tags (tags (*)),
            content_references (citation_note, scientific_references (*)),
            content_relationships!parent_content_id (
              relationship_type,
              related_content:content!related_content_id (
                id, slug, title, description, featured_image, content_type
              )
            )
          `)
          .eq('slug', slug)
          .eq('language', language)
          .eq('status', 'published')
          .order('position', { foreignTable: 'content_blocks', ascending: true })
          .maybeSingle();

        if (!error && data) {
          const formatted = {
            ...data,
            tags: data.content_tags?.map(ct => ct.tags).filter(Boolean) || [],
            scientific_references: data.content_references?.map(cr => ({
              ...cr.scientific_references,
              citation_note: cr.citation_note
            })).filter(Boolean) || [],
            related_content: data.content_relationships?.map(cr => cr.related_content).filter(Boolean) || []
          };
          setCache(cacheKey, formatted);
          return formatted;
        }
      } catch (err) {
        console.warn('contentService.getContentBySlug Supabase fetch fallback:', err);
      }
    }

    // Fallback to local structured data
    const local = LOCAL_FALLBACK_CONTENT[slug];
    if (local && local.language === language) {
      setCache(cacheKey, local);
      return local;
    }

    return null;
  },

  /**
   * 2. Get content by UUID
   */
  async getContentById(id) {
    const cacheKey = `content_id_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content')
          .select(`
            *,
            content_blocks (*),
            content_tags (tags (*)),
            content_references (citation_note, scientific_references (*))
          `)
          .eq('id', id)
          .order('position', { foreignTable: 'content_blocks', ascending: true })
          .maybeSingle();

        if (!error && data) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getContentById fetch fallback:', err);
      }
    }

    return Object.values(LOCAL_FALLBACK_CONTENT).find(c => c.id === id) || null;
  },

  /**
   * 3. Get all published contents with optional filters
   */
  async getPublishedContents(options = {}) {
    const { language = 'ar', limit = 50, offset = 0, contentType } = options;
    const cacheKey = `contents_published_${language}_${contentType || 'all'}_${limit}_${offset}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('content')
          .select('id, slug, title, description, content_type, featured_image, published_at, metadata')
          .eq('status', 'published')
          .eq('language', language)
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (contentType) {
          query = query.eq('content_type', contentType);
        }

        const { data, error } = await query;
        if (!error && data) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getPublishedContents fetch fallback:', err);
      }
    }

    const fallbackList = Object.values(LOCAL_FALLBACK_CONTENT).filter(c =>
      c.status === 'published' &&
      c.language === language &&
      (!contentType || c.content_type === contentType)
    );
    return fallbackList;
  },

  /**
   * 4. Get contents by content_type
   */
  async getContentsByType(contentType, language = 'ar') {
    return this.getPublishedContents({ contentType, language });
  },

  /**
   * 5. Get contents assigned to a specific page route and slot
   */
  async getContentsByLocation(pageRoute, slot = 'main_body') {
    const cacheKey = `content_loc_${pageRoute}_${slot}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_locations')
          .select(`
            order_index,
            slot,
            content:content_id (
              id, slug, title, description, content_type, featured_image,
              markdown_content, css, metadata, published_at,
              content_blocks (*)
            )
          `)
          .eq('page_route', pageRoute)
          .eq('slot', slot)
          .eq('is_visible', true)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          const contents = data
            .map(item => item.content)
            .filter(Boolean);
          setCache(cacheKey, contents);
          return contents;
        }
      } catch (err) {
        console.warn('contentService.getContentsByLocation fetch fallback:', err);
      }
    }

    if (pageRoute === '/ThinkingErrors' || pageRoute === '/home') {
      return [LOCAL_FALLBACK_CONTENT['thinking-errors']];
    }
    return [];
  },

  /**
   * 6. Get content blocks for a specific content item
   */
  async getContentBlocks(contentId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('content_id', contentId)
          .order('position', { ascending: true });

        if (!error && data) return data;
      } catch (err) {
        console.warn('contentService.getContentBlocks fetch fallback:', err);
      }
    }

    const item = Object.values(LOCAL_FALLBACK_CONTENT).find(c => c.id === contentId);
    return item?.content_blocks || [];
  },

  /**
   * 7. Get all modules
   */
  async getAllModules() {
    const cacheKey = 'all_modules';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select(`
            *,
            module_lessons (
              id, section_name, order_index,
              content:content_id (
                id, slug, title, description, content_type, featured_image, metadata
              )
            )
          `)
          .eq('status', 'published')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getAllModules fetch fallback:', err);
      }
    }

    setCache(cacheKey, MODULES_DATA);
    return MODULES_DATA;
  },

  /**
   * 8. Get module by slug with full metadata
   */
  async getModule(moduleSlug) {
    const cacheKey = `module_${moduleSlug}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select(`
            *,
            module_lessons (
              id, section_name, order_index,
              content:content_id (
                id, slug, title, description, content_type, featured_image, metadata
              )
            )
          `)
          .eq('slug', moduleSlug)
          .eq('status', 'published')
          .order('order_index', { foreignTable: 'module_lessons', ascending: true })
          .maybeSingle();

        if (!error && data) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getModule fetch fallback:', err);
      }
    }

    const localMod = MODULES_DATA.find(m => m.slug === moduleSlug || m.id === moduleSlug);
    if (localMod) {
      setCache(cacheKey, localMod);
      return localMod;
    }
    return null;
  },

  /**
   * 9. Get all lessons for a specific module ID
   */
  async getModuleLessons(moduleId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('module_lessons')
          .select(`
            id, section_name, order_index,
            content:content_id (
              id, slug, title, description, content_type, featured_image, metadata
            )
          `)
          .eq('module_id', moduleId)
          .order('order_index', { ascending: true });

        if (!error && data) return data;
      } catch (err) {
        console.warn('contentService.getModuleLessons fetch fallback:', err);
      }
    }

    const localMod = MODULES_DATA.find(m => m.id === moduleId || m.slug === moduleId);
    return localMod?.pages || [];
  },

  /**
   * 10. Get Emotions Encyclopedia items
   */
  async getEmotionsEncyclopedia(options = {}) {
    const { category, search, limit = 200, offset = 0 } = options;
    const cacheKey = `emotions_${category || 'all'}_${search || 'all'}_${limit}_${offset}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('emotions_encyclopedia')
          .select('*')
          .order('arabic_name', { ascending: true })
          .range(offset, offset + limit - 1);

        if (category) {
          query = query.ilike('category', `%${category}%`);
        }
        if (search) {
          query = query.or(`arabic_name.ilike.%${search}%,emotion_key.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getEmotionsEncyclopedia fetch fallback:', err);
      }
    }

    // Fallback to local JSON
    let filtered = [...emotionsFallback];
    if (category) {
      filtered = filtered.filter(e => e.family?.includes(category));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(e => e.name?.includes(s) || e.english_name?.toLowerCase().includes(s));
    }
    setCache(cacheKey, filtered);
    return filtered;
  },

  /**
   * 11. Get Psychology Insights
   */
  async getPsychologyInsights(options = {}) {
    const { topic, isFeatured, limit = 100, offset = 0 } = options;
    const cacheKey = `insights_${topic || 'all'}_${isFeatured ?? 'all'}_${limit}_${offset}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('psychology_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (topic) {
          query = query.eq('topic', topic);
        }
        if (typeof isFeatured === 'boolean') {
          query = query.eq('is_featured', isFeatured);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getPsychologyInsights fetch fallback:', err);
      }
    }

    // Fallback: fetch from public dataset if in browser
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/psychology_insights_dataset.json');
        if (res.ok) {
          const dataset = await res.json();
          setCache(cacheKey, dataset);
          return dataset;
        }
      }
    } catch (e) {
      console.warn('Failed to load psychology_insights_dataset.json fallback:', e);
    }

    return [];
  },

  /**
   * 12. Get Scientific References
   */
  async getScientificReferences(options = {}) {
    const { category, search, limit = 200, offset = 0 } = options;
    const cacheKey = `scientific_refs_${category || 'all'}_${search || 'all'}_${limit}_${offset}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('scientific_references')
          .select('*')
          .order('title', { ascending: true })
          .range(offset, offset + limit - 1);

        if (category && category !== 'الكل' && category !== 'all') {
          query = query.eq('category', category);
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,authors.ilike.%${search}%,publication.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setCache(cacheKey, data);
          return data;
        }
      } catch (err) {
        console.warn('contentService.getScientificReferences fetch fallback:', err);
      }
    }

    return [];
  },

  /**
   * 13. Get related content items
   */
  async getRelatedContent(contentId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_relationships')
          .select(`
            relationship_type,
            related_content:content!related_content_id (
              id, slug, title, description, featured_image, content_type
            )
          `)
          .eq('parent_content_id', contentId)
          .order('order_index', { ascending: true });

        if (!error && data) {
          return data.map(item => ({
            ...item.related_content,
            relationship_type: item.relationship_type
          })).filter(Boolean);
        }
      } catch (err) {
        console.warn('contentService.getRelatedContent fetch fallback:', err);
      }
    }
    return [];
  },

  /**
   * 14. Get scientific references linked to a content item
   */
  async getContentReferences(contentId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_references')
          .select(`
            citation_note,
            scientific_references (*)
          `)
          .eq('content_id', contentId);

        if (!error && data) {
          return data.map(item => ({
            ...item.scientific_references,
            citation_note: item.citation_note
          })).filter(Boolean);
        }
      } catch (err) {
        console.warn('contentService.getContentReferences fetch fallback:', err);
      }
    }
    const item = Object.values(LOCAL_FALLBACK_CONTENT).find(c => c.id === contentId);
    return item?.scientific_references || [];
  },

  /**
   * 15. Full-Text Search across published psychological content
   */
  async searchContent(query, options = {}) {
    const { language = 'ar', limit = 20 } = options;
    if (!query || query.trim() === '') return [];

    const cleanQuery = query.trim();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('id, slug, title, description, content_type, featured_image')
          .eq('language', language)
          .eq('status', 'published')
          .textSearch('search_vector', cleanQuery, {
            type: 'websearch',
            config: 'simple'
          })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data;
        }

        const { data: ilikeData, error: ilikeError } = await supabase
          .from('content')
          .select('id, slug, title, description, content_type, featured_image')
          .eq('language', language)
          .eq('status', 'published')
          .or(`title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,plain_text.ilike.%${cleanQuery}%`)
          .limit(limit);

        if (!ilikeError && ilikeData) {
          return ilikeData;
        }
      } catch (err) {
        console.warn('contentService.searchContent fetch fallback:', err);
      }
    }

    const qLower = cleanQuery.toLowerCase();
    return Object.values(LOCAL_FALLBACK_CONTENT).filter(c =>
      c.status === 'published' &&
      c.language === language &&
      (c.title?.toLowerCase().includes(qLower) ||
       c.description?.toLowerCase().includes(qLower) ||
       c.plain_text?.toLowerCase().includes(qLower))
    );
  },

  /**
   * Alias for getContentBySlug
   */
  async getItemBySlug(slug, language = 'ar') {
    return this.getContentBySlug(slug, language);
  }
};

export default contentService;
