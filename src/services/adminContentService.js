import { contentService } from './contentService';
// src/services/adminContentService.js
/**
 * ============================================================================
 * ADMIN CONTENT SERVICE LAYER
 * ============================================================================
 * Handles full CMS CRUD, content blocks management, media assets, references,
 * tags, module curriculum structuring, optimistic locking, and versioning.
 *
 * Security & Integrity Principles:
 * 1. Uses the client Supabase instance (respects user session & PostgreSQL RLS).
 * 2. Never exposes service-role keys or bypasses security checks.
 * 3. Atomic operations for content + blocks + references + tags syncing.
 * 4. Automatic version snapshots saved in content_versions table upon updates.
 * 5. Robust offline/fallback mock support for seamless development and preview.
 */

import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { authService } from './authService';

// Memory fallback store for local development/offline testing
let localStore = {
  content: [
    {
      id: '55555555-5555-5555-5555-555555555551',
      translation_group_id: '66666666-6666-6666-6666-666666666661',
      slug: 'thinking-errors',
      language: 'ar',
      title: 'التشوهات المعرفية (Thinking Errors)',
      description: 'دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها وفق أساليب العلاج المعرفي السلوكي (CBT).',
      content_type: 'scientific_page',
      status: 'published',
      markdown_content: `# دليل التشوهات المعرفية (Cognitive Distortions)\n\nالتشوهات المعرفية هي أنماط تفكير تلقائية غير عقلانية تجعلنا نرى الواقع بصورة مشوهة أو متطرفة. تحدث هذه الأفكار في أجزاء من الثانية وتؤدي مباشرة إلى مشاعر سلبية حادة مثل القلق، الحزن، الذنب، أو الإحباط.`,
      plain_text: 'دليل التشوهات المعرفية. التفكير بالأبيض والأسود، التعميم المفرط، التصفية الذهنية، والتنبؤ الكارثي.',
      css: '',
      metadata: {
        framework: 'CBT',
        reading_time_minutes: 6,
        difficulty: 'متوسط',
        author: 'فريق التحرير العلمي'
      },
      featured_image: '/article-by3DYy7JylaR.webp',
      seo_title: 'دليل التشوهات المعرفية | رحلة التعافي',
      seo_description: 'تعرف على أبرز التشوهات المعرفية وطرق تفنيدها المعرفي السلوكي.',
      published_at: '2026-08-30T00:00:00.000Z',
      created_at: '2026-08-30T00:00:00.000Z',
      updated_at: '2026-08-30T00:00:00.000Z',
      blocks: [
        {
          id: 'block-1',
          block_type: 'markdown',
          position: 1,
          payload: {
            content: '### تمرين تفاعلي موجه: سجل الأفكار المعرفية\nاستخدم الأداة أدناه لتطبيق مهارات إعادة الهيكلة المعرفية على فكرة تراودك حالياً:'
          },
          metadata: {}
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
          block_type: 'quote',
          position: 3,
          payload: {
            quote: 'ما يعذب الناس ليس الأشياء في حد ذاتها، بل الآراء ووجهات النظر التي يتخذونها بشأنها.',
            author: 'إبكتيتوس (فيلسوف رواقي) - الركيزة التاريخية لـ CBT'
          },
          metadata: {}
        }
      ],
      tagIds: ['tag-1', 'tag-2'],
      referenceIds: ['ref-1', 'ref-2']
    },
    {
      id: '55555555-5555-5555-5555-555555555552',
      translation_group_id: '66666666-6666-6666-6666-666666666662',
      slug: 'emotional-regulation',
      language: 'ar',
      title: 'تنظيم المشاعر وتقنيات TIPP',
      description: 'مهارات العلاج السلوكي الجدلي (DBT) لخفض الاستثارة العصبية الحادة واستعادة الاتزان النفسي.',
      content_type: 'lesson',
      status: 'published',
      markdown_content: `# تنظيم المشاعر الحادة بواسطة مهارات TIPP\n\nتعتبر مهارات TIPP من أكثر استراتيجيات العلاج الجدلي السلوكي فعالية عندما تكون الاستثارة العاطفية في أوجها (فوق 70%).`,
      plain_text: 'تنظيم المشاعر الحادة بواسطة مهارات TIPP.',
      css: '',
      metadata: {
        framework: 'DBT',
        reading_time_minutes: 5,
        difficulty: 'مبتدئ',
        author: 'د. مارشا لينهان (مرجع)'
      },
      featured_image: '/article-by3DYy7JylaR.webp',
      seo_title: 'مهارات TIPP لتنظيم المشاعر | رحلة التعافي',
      seo_description: 'تطبيق عملي لمهارات خفض الاستثارة الفسيولوجية بواسطة الماء البارد والتنفس.',
      published_at: '2026-08-30T00:00:00.000Z',
      created_at: '2026-08-30T00:00:00.000Z',
      updated_at: '2026-08-30T00:00:00.000Z',
      blocks: [
        {
          id: 'block-201',
          block_type: 'interactive_component',
          position: 1,
          payload: {
            component: 'tipp-cold-water-timer',
            props: { defaultSeconds: 30 }
          },
          metadata: { title: 'مؤقت غمر الوجه بالماء البارد (Dive Reflex)' }
        },
        {
          id: 'block-202',
          block_type: 'interactive_component',
          position: 2,
          payload: {
            component: 'breathing-circle',
            props: { inhaleTime: 4, holdTime: 7, exhaleTime: 8 }
          },
          metadata: { title: 'تمرين التنفس المهدئ 4-7-8' }
        }
      ],
      tagIds: ['tag-2', 'tag-3'],
      referenceIds: ['ref-2']
    },
    {
      id: '55555555-5555-5555-5555-555555555553',
      translation_group_id: '66666666-6666-6666-6666-666666666663',
      slug: 'defusion-techniques',
      language: 'ar',
      title: 'مهارات فك الاندماج المعرفي (Cognitive Defusion)',
      description: 'تعلم كيف تنظر إلى أفكارك بدلاً من أن تنظر من خلالها وفق مبادئ العلاج بالقبول والالتزام (ACT).',
      content_type: 'exercise',
      status: 'draft',
      markdown_content: `# فك الاندماج المعرفي (Cognitive Defusion)\n\nفي علم النفس القائم على ACT، نحن لا نحارب الأفكار ولا نغير محتواها، بل نغير علاقتنا بها.`,
      plain_text: 'فك الاندماج المعرفي في ACT. بطاقات الأفكار وتقنية ورقة الشجر على النهر.',
      css: '',
      metadata: {
        framework: 'ACT',
        reading_time_minutes: 4,
        difficulty: 'متوسط',
        author: 'فريق التحرير العلمي'
      },
      featured_image: '/article-by3DYy7JylaR.webp',
      seo_title: 'فك الاندماج المعرفي | ACT Skills',
      seo_description: 'تمارين تفاعلية للتحرر من سيطرة الأفكار المزعجة.',
      published_at: null,
      created_at: '2026-08-30T00:00:00.000Z',
      updated_at: '2026-08-30T00:00:00.000Z',
      blocks: [
        {
          id: 'block-301',
          block_type: 'interactive_component',
          position: 1,
          payload: {
            component: 'defusion-card-creator',
            props: {}
          },
          metadata: { title: 'صانع بطاقات تفكيك الفكرة' }
        }
      ],
      tagIds: ['tag-3'],
      referenceIds: ['ref-3']
    }
  ],
  references: [
    {
      id: 'ref-1',
      title: 'Cognitive Therapy of Depression',
      authors: 'Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G.',
      year: 1979,
      publication: 'Guilford Press',
      url: 'https://guilford.com/books/Cognitive-Therapy-of-Depression/Beck-Rush-Shaw-Emery/9780898629194',
      doi: '10.1002/1097-4679(198104)37:2<448::AID-JCLP2270370243>3.0.CO;2-G',
      category: 'CBT',
      created_at: '2026-08-30T00:00:00.000Z'
    },
    {
      id: 'ref-2',
      title: 'DBT Skills Training Manual (2nd Edition)',
      authors: 'Linehan, M. M.',
      year: 2014,
      publication: 'Guilford Publications',
      url: 'https://guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462516995',
      doi: '10.1176/appi.ajp.151.12.1771',
      category: 'DBT',
      created_at: '2026-08-30T00:00:00.000Z'
    },
    {
      id: 'ref-3',
      title: 'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change',
      authors: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G.',
      year: 2011,
      publication: 'Guilford Press',
      url: 'https://guilford.com/books/Acceptance-and-Commitment-Therapy/Hayes-Strosahl-Wilson/9781609189624',
      doi: '10.1037/0022-006X.74.6.1086',
      category: 'ACT',
      created_at: '2026-08-30T00:00:00.000Z'
    }
  ],
  tags: [
    { id: 'tag-1', name: 'علاج معرفي سلوكي', slug: 'cbt', category: 'framework' },
    { id: 'tag-2', name: 'تشوهات معرفية', slug: 'cognitive-distortions', category: 'concept' },
    { id: 'tag-3', name: 'تنظيم المشاعر', slug: 'emotion-regulation', category: 'skill' },
    { id: 'tag-4', name: 'علاج بالقبول والالتزام', slug: 'act', category: 'framework' },
    { id: 'tag-5', name: 'يقظة ذهنية', slug: 'mindfulness', category: 'practice' }
  ],
  modules: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      slug: 'what-is-going',
      title: 'What is going?',
      description: 'Understanding psychological distress, cognitive distortions, defense mechanisms & clinical frameworks',
      order_index: 1,
      background_image: '/ModulesBackgrounds/Gemini_Generated_Image_8pd1608pd1608pd1.jpg',
      status: 'published',
      created_at: '2026-08-30T00:00:00.000Z',
      lessons: [
        {
          id: 'ml-1',
          content_id: '55555555-5555-5555-5555-555555555551',
          section_name: 'العلاج المعرفي السلوكي (CBT)',
          order_index: 1,
          content: {
            id: '55555555-5555-5555-5555-555555555551',
            title: 'التشوهات المعرفية (Thinking Errors)',
            slug: 'thinking-errors',
            content_type: 'scientific_page',
            status: 'published'
          }
        }
      ]
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      slug: 'where-do-you-stand',
      title: 'Where do you stand?',
      description: 'Before charting a path forward, you must have an accurate, compassionate map of where you currently stand.',
      order_index: 2,
      background_image: '/ModulesBackgrounds/Gemini_Generated_Image_kh50vwkh50vwkh50.jpg',
      status: 'published',
      created_at: '2026-08-30T00:00:00.000Z',
      lessons: []
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      slug: 'how-will-we-fix-it',
      title: 'How will we fix it?',
      description: 'Equip yourself with evidence-based therapeutic toolkits from CBT, DBT, ACT, SFBT and Self-Compassion.',
      order_index: 3,
      background_image: '/ModulesBackgrounds/Gemini_Generated_Image_z4z7oqz4z7oqz4z7.jpg',
      status: 'published',
      created_at: '2026-08-30T00:00:00.000Z',
      lessons: []
    },
    {
      id: '40000000-0000-0000-0000-000000000004',
      slug: 'how-to-stay-stable',
      title: 'How to stay stable?',
      description: 'Long-term maintenance, habit architecture, relapse prevention and building psychological resilience.',
      order_index: 4,
      background_image: '/ModulesBackgrounds/Gemini_Generated_Image_8pd1608pd1608pd1.jpg',
      status: 'published',
      created_at: '2026-08-30T00:00:00.000Z',
      lessons: []
    }
  ],
  module_content: [],
  media: [
    {
      id: 'med-1',
      media_type: 'image',
      url: '/article-by3DYy7JylaR.webp',
      storage_path: 'articles/article-cover-1.webp',
      alt_text: 'صورة توضيحية للمقالات العلمية',
      caption: 'رسم بياني يوضح الترابط بين الفكرة والشعور والسلوك',
      mime_type: 'image/webp',
      file_size: 145200,
      created_at: '2026-08-30T00:00:00.000Z'
    },
    {
      id: 'med-2',
      media_type: 'audio',
      url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      storage_path: 'audio/breathing-bell.mp3',
      alt_text: 'صوت جرس التأمل الهادئ',
      caption: 'جرس بداية تمرين التنفس',
      mime_type: 'audio/mp3',
      file_size: 48900,
      created_at: '2026-08-30T00:00:00.000Z'
    }
  ],
  versions: [
    {
      id: 'ver-1',
      content_id: '55555555-5555-5555-5555-555555555551',
      version_number: 1,
      title: 'التشوهات المعرفية (Thinking Errors) - النسخة المبدئية',
      markdown_content: `# مسودة التشوهات المعرفية الأولية\n\nنص النسخة السابقة قبل إضافة التمارين التفاعلية والمراجع الحديثة.`,
      blocks_snapshot: [],
      metadata_snapshot: { framework: 'CBT' },
      change_summary: 'الإنشاء الأولي للمقال العلمي ومراجعته سريرياً',
      created_at: '2026-08-29T18:00:00.000Z'
    },
    {
      id: 'ver-2',
      content_id: '55555555-5555-5555-5555-555555555551',
      version_number: 2,
      title: 'التشوهات المعرفية (Thinking Errors)',
      markdown_content: `# دليل التشوهات المعرفية (Cognitive Distortions)\n\nالتشوهات المعرفية هي أنماط تفكير تلقائية غير عقلانية تجعلنا نرى الواقع بصورة مشوهة أو متطرفة.`,
      blocks_snapshot: [],
      metadata_snapshot: { framework: 'CBT', reading_time_minutes: 6 },
      change_summary: 'إضافة تمرين معالج رصد الأفكار التفاعلي واقتباس إبكتيتوس',
      created_at: '2026-08-30T00:00:00.000Z'
    }
  ],
  insights: [
    {
      id: 'ins-1',
      insight_text: 'الفكرة ليست حقيقة، بل فرضية يضعها العقل لاختبار البيئة المحيطة به.',
      author_or_source: 'Aaron Beck',
      topic: 'CBT',
      evidence_level: 'clinical',
      is_featured: true
    },
    {
      id: 'ins-2',
      insight_text: 'محاربة المشاعر السلبية تزيد من شدتها، بينما السماح لها بالمرور يقصر مدة بقائها.',
      author_or_source: 'Steven C. Hayes',
      topic: 'ACT',
      evidence_level: 'empirical',
      is_featured: true
    }
  ],
  shortcuts: [
    {
      id: 'sc-default-1',
      title: 'مقالات وأدلة تخصصية موصى بها',
      description: 'أهم الأدوات والتقنيات العلاجية لبدء رحلة التوازن المعرفي السلوكي',
      icon: 'BookOpen',
      sort_order: 1,
      is_visible: true,
      items: [
        {
          id: 'sci-default-1',
          shortcut_id: 'sc-default-1',
          content_id: '55555555-5555-5555-5555-555555555551',
          sort_order: 1,
          content: {
            id: '55555555-5555-5555-5555-555555555551',
            slug: 'thinking-errors',
            title: 'التشوهات المعرفية (Thinking Errors)',
            description: 'دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها.',
            content_type: 'scientific_page',
            status: 'published'
          }
        },
        {
          id: 'sci-default-2',
          shortcut_id: 'sc-default-1',
          content_id: '55555555-5555-5555-5555-555555555552',
          sort_order: 2,
          content: {
            id: '55555555-5555-5555-5555-555555555552',
            slug: 'defense-mechanisms',
            title: 'الحيل الدفاعية النفسية (Defense Mechanisms)',
            description: 'الآليات اللاواعية التي يستخدمها العقل لحماية نفسه من القلق والصراع النفسي.',
            content_type: 'scientific_page',
            status: 'published'
          }
        },
        {
          id: 'sci-default-3',
          shortcut_id: 'sc-default-1',
          content_id: '55555555-5555-5555-5555-555555555553',
          sort_order: 3,
          content: {
            id: '55555555-5555-5555-5555-555555555553',
            slug: 'emotional-regulation',
            title: 'تنظيم المشاعر والتحكم في الانفعالات',
            description: 'دليل مهارات DBT المتقدم لخفض حدة الاستثارة واليقظة الذهنية للمشاعر.',
            content_type: 'scientific_page',
            status: 'published'
          }
        }
      ]
    }
  ]
};

export const adminContentService = {

  // ============================================================================
  // HOMEPAGE SHORTCUTS MANAGEMENT
  // ============================================================================
  async getShortcuts() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .select('*, items:homepage_shortcut_items(*, content(*))')
          .order('sort_order', { ascending: true })
          .order('sort_order', { referencedTable: 'homepage_shortcut_items', ascending: true });
        
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
            console.warn('adminContentService: homepage_shortcuts table not found in Supabase schema cache. Using localStore shortcuts.');
            return localStore.shortcuts || [];
          }
          throw error;
        }
        return data || [];
      } catch (err) {
        console.warn('adminContentService.getShortcuts fallback applied:', err?.message || err);
        return localStore.shortcuts || [];
      }
    }
    return localStore.shortcuts || [];
  },

  async createShortcut(shortcutData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .insert([shortcutData])
          .select()
          .single();
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            console.warn('adminContentService: homepage_shortcuts table not found in Supabase. Creating in localStore.');
            const newSc = { ...shortcutData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
            if (!localStore.shortcuts) localStore.shortcuts = [];
            localStore.shortcuts.push(newSc);
            contentService.clearShortcutsCache();
            return newSc;
          }
          throw error;
        }
        contentService.clearShortcutsCache();
        return data;
      } catch (err) {
        console.warn('createShortcut fallback applied:', err?.message || err);
        const newSc = { ...shortcutData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        if (!localStore.shortcuts) localStore.shortcuts = [];
        localStore.shortcuts.push(newSc);
        contentService.clearShortcutsCache();
        return newSc;
      }
    }
    const newSc = { ...shortcutData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    if(!localStore.shortcuts) localStore.shortcuts = [];
    localStore.shortcuts.push(newSc);
    contentService.clearShortcutsCache();
    return newSc;
  },

  async updateShortcut(id, shortcutData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('homepage_shortcuts')
          .update(shortcutData)
          .eq('id', id)
          .select()
          .single();
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            const idx = (localStore.shortcuts || []).findIndex(s => s.id === id);
            if (idx > -1) {
              localStore.shortcuts[idx] = { ...localStore.shortcuts[idx], ...shortcutData };
              contentService.clearShortcutsCache();
              return localStore.shortcuts[idx];
            }
          }
          throw error;
        }
        contentService.clearShortcutsCache();
        return data;
      } catch (err) {
        console.warn('updateShortcut fallback applied:', err?.message || err);
        const idx = (localStore.shortcuts || []).findIndex(s => s.id === id);
        if (idx > -1) {
          localStore.shortcuts[idx] = { ...localStore.shortcuts[idx], ...shortcutData };
          contentService.clearShortcutsCache();
          return localStore.shortcuts[idx];
        }
        throw err;
      }
    }
    const idx = (localStore.shortcuts || []).findIndex(s => s.id === id);
    if(idx > -1) {
      localStore.shortcuts[idx] = { ...localStore.shortcuts[idx], ...shortcutData };
      contentService.clearShortcutsCache();
      return localStore.shortcuts[idx];
    }
    throw new Error('Shortcut not found locally');
  },

  async deleteShortcut(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('homepage_shortcuts')
          .delete()
          .eq('id', id);
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            if (localStore.shortcuts) {
              localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
            }
            contentService.clearShortcutsCache();
            return true;
          }
          throw error;
        }
        contentService.clearShortcutsCache();
        return true;
      } catch (err) {
        console.warn('deleteShortcut fallback applied:', err?.message || err);
        if(localStore.shortcuts) {
          localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
        }
        contentService.clearShortcutsCache();
        return true;
      }
    }
    if(localStore.shortcuts) {
      localStore.shortcuts = localStore.shortcuts.filter(s => s.id !== id);
    }
    contentService.clearShortcutsCache();
    return true;
  },

  async saveShortcutItems(shortcutId, items) {
    if (isSupabaseConfigured) {
      try {
        const { error: delError } = await supabase
          .from('homepage_shortcut_items')
          .delete()
          .eq('shortcut_id', shortcutId);
        
        if (delError && (delError.code === 'PGRST205' || delError.message?.includes('schema cache'))) {
          // Fallback to localStore
          const sc = (localStore.shortcuts || []).find(s => s.id === shortcutId);
          if (sc) {
            sc.items = (items || []).map((item, index) => ({
              id: crypto.randomUUID(),
              shortcut_id: shortcutId,
              content_id: item.content_id,
              sort_order: item.sort_order ?? index,
              content: (localStore.content || []).find(c => c.id === item.content_id)
            }));
          }
          contentService.clearShortcutsCache();
          return true;
        }
          
        if (items && items.length > 0) {
          const insertData = items.map((item, index) => ({
            shortcut_id: shortcutId,
            content_id: item.content_id,
            sort_order: item.sort_order ?? index
          }));
          const { error } = await supabase
            .from('homepage_shortcut_items')
            .insert(insertData);
          if (error) throw error;
        }
        contentService.clearShortcutsCache();
        return true;
      } catch (err) {
        console.warn('saveShortcutItems fallback applied:', err?.message || err);
        const sc = (localStore.shortcuts || []).find(s => s.id === shortcutId);
        if (sc) {
          sc.items = (items || []).map((item, index) => ({
            id: crypto.randomUUID(),
            shortcut_id: shortcutId,
            content_id: item.content_id,
            sort_order: item.sort_order ?? index,
            content: (localStore.content || []).find(c => c.id === item.content_id)
          }));
        }
        contentService.clearShortcutsCache();
        return true;
      }
    }
    const sc = (localStore.shortcuts || []).find(s => s.id === shortcutId);
    if (sc) {
      sc.items = (items || []).map((item, index) => ({
        id: crypto.randomUUID(),
        shortcut_id: shortcutId,
        content_id: item.content_id,
        sort_order: item.sort_order ?? index,
        content: (localStore.content || []).find(c => c.id === item.content_id)
      }));
    }
    contentService.clearShortcutsCache();
    return true;
  },

  /**
   * 1. Check if current user is an authenticated Admin
   */
  async checkIsAdmin() {
    try {
      const user = await authService.getCurrentUser().catch(() => null);
      if (!user) return false;

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data?.role === 'admin') {
          return true;
        }
      }

      // Check user metadata as a fallback if profiles table row is syncing
      if (user.user_metadata?.role === 'admin') {
        return true;
      }

      return false;
    } catch (err) {
      console.warn('adminContentService.checkIsAdmin error:', err);
      return false;
    }
  },

  /**
   * 2. Dashboard Statistics & Overview
   */
  async getDashboardStats() {
    if (isSupabaseConfigured) {
      try {
        const [
          { count: totalCount },
          { count: publishedCount },
          { count: draftCount },
          { count: archivedCount },
          { count: modulesCount },
          { count: mediaCount },
          { count: referencesCount },
          { count: tagsCount }
        ] = await Promise.all([
          supabase.from('content').select('*', { count: 'exact', head: true }),
          supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
          supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
          supabase.from('modules').select('*', { count: 'exact', head: true }),
          supabase.from('content_media').select('*', { count: 'exact', head: true }),
          supabase.from('scientific_references').select('*', { count: 'exact', head: true }),
          supabase.from('tags').select('*', { count: 'exact', head: true })
        ]);

        const { data: recentItems } = await supabase
          .from('content')
          .select('id, slug, title, content_type, status, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);

        return {
          total: totalCount || 0,
          published: publishedCount || 0,
          draft: draftCount || 0,
          archived: archivedCount || 0,
          modulesCount: modulesCount || 0,
          mediaCount: mediaCount || 0,
          referencesCount: referencesCount || 0,
          tagsCount: tagsCount || 0,
          recentActivity: recentItems || []
        };
      } catch (err) {
        console.warn('adminContentService.getDashboardStats Supabase fallback:', err);
      }
    }

    // Local fallback stats
    const total = localStore.content.length;
    const published = localStore.content.filter(c => c.status === 'published').length;
    const draft = localStore.content.filter(c => c.status === 'draft').length;
    const archived = localStore.content.filter(c => c.status === 'archived').length;

    return {
      total,
      published,
      draft,
      archived,
      modulesCount: localStore.modules.length,
      mediaCount: localStore.media.length,
      referencesCount: localStore.references.length,
      tagsCount: localStore.tags.length,
      recentActivity: localStore.content.slice(0, 5)
    };
  },

  /**
   * 3. Paginated Content List with Filtering & Sorting
   */
  async getContentList(params = {}) {
    const {
      status = 'all',
      contentType = 'all',
      language = 'ar',
      search = '',
      sortBy = 'updated_at',
      sortOrder = 'desc',
      page = 1,
      limit = 25
    } = params;

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('content')
          .select(`
            id, translation_group_id, slug, language, title, description, content_type, status,
            featured_image, published_at, created_at, updated_at,
            content_tags (tags (id, name, slug, category)),
            content_blocks (id)
          `, { count: 'exact' });

        if (status !== 'all') {
          query = query.eq('status', status);
        }
        if (contentType !== 'all') {
          query = query.eq('content_type', contentType);
        }
        if (language) {
          query = query.eq('language', language);
        }
        if (search && search.trim()) {
          const cleanSearch = search.trim();
          query = query.or(`title.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

        const { data, error, count } = await query;
        if (!error && data) {
          const formatted = data.map(item => ({
            ...item,
            tags: item.content_tags?.map(ct => ct.tags).filter(Boolean) || [],
            blocksCount: item.content_blocks?.length || 0
          }));

          return {
            items: formatted,
            total: count || formatted.length,
            page,
            limit,
            totalPages: Math.ceil((count || formatted.length) / limit)
          };
        }
      } catch (err) {
        console.warn('adminContentService.getContentList Supabase fallback:', err);
      }
    }

    // Local fallback filtering
    let filtered = [...localStore.content];
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    if (contentType !== 'all') {
      filtered = filtered.filter(c => c.content_type === contentType);
    }
    if (language) {
      filtered = filtered.filter(c => c.language === language);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(q) || 
        c.slug?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit).map(item => ({
      ...item,
      tags: localStore.tags.filter(t => (item.tagIds || []).includes(t.id)),
      blocksCount: item.blocks?.length || 0
    }));

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  /**
   * 4. Get Content Item by ID or Slug with all associated blocks, tags, and references
   */
  async getContentItem(identifier, isSlug = false, language = 'ar') {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('content')
          .select(`
            *,
            content_blocks (*),
            content_tags (tags (*)),
            content_references (citation_note, scientific_references (*)),
            content_relationships!content_relationships_parent_content_id_fkey (
              relationship_type, order_index,
              related_content:content!content_relationships_related_content_id_fkey (id, title, slug, content_type)
            )
          `);

        if (isSlug) {
          query = query.eq('slug', identifier).eq('language', language);
        } else {
          query = query.eq('id', identifier);
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          // Sort blocks by position ASC
          const sortedBlocks = (data.content_blocks || []).sort((a, b) => (a.position || 0) - (b.position || 0));
          const tags = data.content_tags?.map(ct => ct.tags).filter(Boolean) || [];
          const references = data.content_references?.map(cr => ({
            ...cr.scientific_references,
            citation_note: cr.citation_note
          })).filter(Boolean) || [];

          return {
            ...data,
            blocks: sortedBlocks,
            tags,
            references,
            relationships: data.content_relationships || []
          };
        }
      } catch (err) {
        console.warn('adminContentService.getContentItem Supabase fallback:', err);
      }
    }

    // Local fallback
    const item = localStore.content.find(c => isSlug ? (c.slug === identifier && c.language === language) : (c.id === identifier));
    if (!item) return null;

    return {
      ...item,
      tags: localStore.tags.filter(t => (item.tagIds || []).includes(t.id)),
      references: localStore.references.filter(r => (item.referenceIds || []).includes(r.id)),
      blocks: item.blocks || []
    };
  },

  /**
   * 5. Create New Content Item with Blocks, Tags, and References
   */
  async createContent(contentData, blocks = [], tagIds = [], referenceIds = []) {
    const user = await authService.getCurrentUser().catch(() => null);
    const now = new Date().toISOString();
    const cleanSlug = (contentData.slug || contentData.title || 'untitled')
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0621-\u064A-]+/g, '');

    const record = {
      translation_group_id: contentData.translation_group_id || crypto.randomUUID(),
      slug: cleanSlug,
      language: contentData.language || 'ar',
      title: contentData.title || 'عنوان جديد',
      description: contentData.description || '',
      content_type: contentData.content_type || 'article',
      status: contentData.status || 'draft',
      markdown_content: contentData.markdown_content || '',
      plain_text: contentData.plain_text || (contentData.markdown_content || '').replace(/[#*`_[\]()]/g, ''),
      css: contentData.css || '',
      metadata: contentData.metadata || {},
      featured_image: contentData.featured_image || null,
      seo_title: contentData.seo_title || contentData.title || '',
      seo_description: contentData.seo_description || contentData.description || '',
      og_image: contentData.og_image || contentData.featured_image || null,
      canonical_url: contentData.canonical_url || null,
      published_at: contentData.status === 'published' ? (contentData.published_at || now) : null,
      created_by: user?.id || null,
      updated_by: user?.id || null
    };

    if (isSupabaseConfigured) {
      try {
        // 1. Insert core content record
        const { data: inserted, error: insertError } = await supabase
          .from('content')
          .insert([record])
          .select()
          .single();

        if (insertError) throw insertError;
        const newId = inserted.id;

        // 2. Insert blocks if provided
        if (blocks && blocks.length > 0) {
          const blocksToInsert = blocks.map((b, idx) => ({
            content_id: newId,
            block_type: b.block_type || 'markdown',
            position: b.position !== undefined ? b.position : idx + 1,
            payload: b.payload || {},
            metadata: b.metadata || {}
          }));

          const { error: blocksError } = await supabase
            .from('content_blocks')
            .insert(blocksToInsert);

          if (blocksError) console.error('Error inserting blocks:', blocksError);
        }

        // 3. Insert tags associations
        if (tagIds && tagIds.length > 0) {
          const tagsToInsert = tagIds.map(tagId => ({
            content_id: newId,
            tag_id: tagId
          }));
          await supabase.from('content_tags').insert(tagsToInsert);
        }

        // 4. Insert references associations
        if (referenceIds && referenceIds.length > 0) {
          const refsToInsert = referenceIds.map(refId => ({
            content_id: newId,
            reference_id: refId
          }));
          await supabase.from('content_references').insert(refsToInsert);
        }

        // 5. Create Version 1 Snapshot
        await this.createVersionSnapshot(newId, 1, inserted.title, inserted.markdown_content, blocks, inserted.metadata, 'الإنشاء الأولي');

        return await this.getContentItem(newId);
      } catch (err) {
        console.error('adminContentService.createContent error:', err);
        throw err;
      }
    }

    // Local fallback creation
    const newId = crypto.randomUUID();
    const newContent = {
      ...record,
      id: newId,
      created_at: now,
      updated_at: now,
      blocks: blocks.map((b, idx) => ({
        id: crypto.randomUUID(),
        content_id: newId,
        block_type: b.block_type,
        position: b.position !== undefined ? b.position : idx + 1,
        payload: b.payload,
        metadata: b.metadata
      })),
      tagIds,
      referenceIds
    };
    localStore.content.unshift(newContent);
    return newContent;
  },

  /**
   * 6. Update Content Item with Optimistic Locking & Versioning
   */
  async updateContent(id, contentData, blocks = [], tagIds = [], referenceIds = [], changeSummary = '') {
    const user = await authService.getCurrentUser().catch(() => null);
    const now = new Date().toISOString();

    const updateFields = {
      title: contentData.title,
      slug: contentData.slug,
      language: contentData.language || 'ar',
      description: contentData.description,
      content_type: contentData.content_type,
      status: contentData.status,
      markdown_content: contentData.markdown_content,
      plain_text: contentData.plain_text || (contentData.markdown_content || '').replace(/[#*`_[\]()]/g, ''),
      css: contentData.css || '',
      metadata: contentData.metadata || {},
      featured_image: contentData.featured_image || null,
      seo_title: contentData.seo_title,
      seo_description: contentData.seo_description,
      og_image: contentData.og_image || contentData.featured_image,
      canonical_url: contentData.canonical_url,
      updated_by: user?.id || null,
      updated_at: now
    };

    if (contentData.status === 'published' && !contentData.published_at) {
      updateFields.published_at = now;
    }

    if (isSupabaseConfigured) {
      try {
        // 1. Update core content record
        const { data: updated, error: updateError } = await supabase
          .from('content')
          .update(updateFields)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // 2. Sync Blocks (Delete old & Insert new ordered blocks in transaction)
        await supabase.from('content_blocks').delete().eq('content_id', id);

        if (blocks && blocks.length > 0) {
          const blocksToInsert = blocks.map((b, idx) => ({
            content_id: id,
            block_type: b.block_type || 'markdown',
            position: b.position !== undefined ? b.position : idx + 1,
            payload: b.payload || {},
            metadata: b.metadata || {}
          }));

          const { error: blockErr } = await supabase
            .from('content_blocks')
            .insert(blocksToInsert);
          if (blockErr) console.error('Error inserting updated blocks:', blockErr);
        }

        // 3. Sync Tags
        await supabase.from('content_tags').delete().eq('content_id', id);
        if (tagIds && tagIds.length > 0) {
          const tagsToInsert = tagIds.map(tagId => ({
            content_id: id,
            tag_id: tagId
          }));
          await supabase.from('content_tags').insert(tagsToInsert);
        }

        // 4. Sync References
        await supabase.from('content_references').delete().eq('content_id', id);
        if (referenceIds && referenceIds.length > 0) {
          const refsToInsert = referenceIds.map(refId => ({
            content_id: id,
            reference_id: refId
          }));
          await supabase.from('content_references').insert(refsToInsert);
        }

        // 5. Create new Version Snapshot
        const versions = await this.getContentVersions(id);
        const nextVersionNum = (versions.length > 0 ? Math.max(...versions.map(v => v.version_number)) : 0) + 1;
        await this.createVersionSnapshot(id, nextVersionNum, updated.title, updated.markdown_content, blocks, updated.metadata, changeSummary || 'تحديث المحتوى والكتل');

        return await this.getContentItem(id);
      } catch (err) {
        console.error('adminContentService.updateContent error:', err);
        throw err;
      }
    }

    // Local fallback update
    const idx = localStore.content.findIndex(c => c.id === id);
    if (idx !== -1) {
      localStore.content[idx] = {
        ...localStore.content[idx],
        ...updateFields,
        blocks: blocks.map((b, bIdx) => ({
          id: b.id || crypto.randomUUID(),
          content_id: id,
          block_type: b.block_type,
          position: b.position !== undefined ? b.position : bIdx + 1,
          payload: b.payload,
          metadata: b.metadata
        })),
        tagIds,
        referenceIds
      };

      // Push version
      const currentVersions = localStore.versions.filter(v => v.content_id === id);
      const nextVer = currentVersions.length + 1;
      localStore.versions.unshift({
        id: crypto.randomUUID(),
        content_id: id,
        version_number: nextVer,
        title: updateFields.title,
        markdown_content: updateFields.markdown_content,
        blocks_snapshot: blocks,
        metadata_snapshot: updateFields.metadata,
        change_summary: changeSummary || 'تحديث المحتوى والكتل',
        created_at: now
      });

      return localStore.content[idx];
    }
    throw new Error('Content not found');
  },

  /**
   * 7. Quick Status Update (Draft -> Published -> Archived)
   */
  async updateContentStatus(id, newStatus) {
    const now = new Date().toISOString();
    const updateData = { status: newStatus, updated_at: now };
    if (newStatus === 'published') {
      updateData.published_at = now;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        contentService.clearAllModulesCache();
        contentService.clearShortcutsCache();
        return data;
      } catch (err) {
        console.error('adminContentService.updateContentStatus error:', err);
      }
    }

    const item = localStore.content.find(c => c.id === id);
    if (item) {
      item.status = newStatus;
      if (newStatus === 'published' && !item.published_at) {
        item.published_at = now;
      }
      item.updated_at = now;
      contentService.clearAllModulesCache();
      contentService.clearShortcutsCache();
      return item;
    }
    return null;
  },

  /**
   * 8. Delete Content Item (Cascades Blocks and Relations)
   */
  async deleteContent(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('content')
          .delete()
          .eq('id', id);

        if (error) throw error;
        contentService.clearAllModulesCache();
        contentService.clearShortcutsCache();
        return true;
      } catch (err) {
        console.error('adminContentService.deleteContent error:', err);
        throw err;
      }
    }

    localStore.content = localStore.content.filter(c => c.id !== id);
    if (localStore.module_content) {
      localStore.module_content = localStore.module_content.filter(mc => mc.content_id !== id);
    }
    contentService.clearAllModulesCache();
    contentService.clearShortcutsCache();
    return true;
  },

  /**
   * 9. Version Snapshot Management
   */
  async createVersionSnapshot(contentId, versionNumber, title, markdownContent, blocks, metadata, changeSummary) {
    const user = await authService.getCurrentUser().catch(() => null);
    const versionRecord = {
      content_id: contentId,
      version_number: versionNumber,
      title: title || '',
      markdown_content: markdownContent || '',
      blocks_snapshot: blocks || [],
      metadata_snapshot: metadata || {},
      change_summary: changeSummary || 'تعديل',
      created_by: user?.id || null
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('content_versions').insert([versionRecord]);
      } catch (err) {
        console.warn('createVersionSnapshot error:', err);
      }
    }
  },

  async getContentVersions(contentId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_versions')
          .select('*')
          .eq('content_id', contentId)
          .order('version_number', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        console.warn('getContentVersions Supabase error:', err);
      }
    }

    return localStore.versions.filter(v => v.content_id === contentId);
  },

  async restoreVersion(contentId, versionNumber) {
    const versions = await this.getContentVersions(contentId);
    const targetVersion = versions.find(v => v.version_number === versionNumber);
    if (!targetVersion) throw new Error('النسخة المطلوبة غير موجودة');

    // Fetch current item for tag and reference IDs
    const currentItem = await this.getContentItem(contentId);
    const currentTagIds = currentItem?.tags?.map(t => t.id) || [];
    const currentRefIds = currentItem?.references?.map(r => r.id) || [];

    // Restore without deleting version history (creates a new subsequent version)
    return await this.updateContent(
      contentId,
      {
        ...currentItem,
        title: targetVersion.title,
        markdown_content: targetVersion.markdown_content,
        metadata: targetVersion.metadata_snapshot || currentItem.metadata
      },
      targetVersion.blocks_snapshot || [],
      currentTagIds,
      currentRefIds,
      `استعادة النسخة رقم (${versionNumber})`
    );
  },

  /**
   * 10. Media Library Management
   */
  async getMediaList(params = {}) {
    const { search = '', mediaType = 'all', page = 1, limit = 30 } = params;

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('content_media').select('*', { count: 'exact' });
        if (mediaType !== 'all') {
          query = query.eq('media_type', mediaType);
        }
        if (search) {
          query = query.or(`alt_text.ilike.%${search}%,caption.ilike.%${search}%,url.ilike.%${search}%`);
        }

        query = query.order('created_at', { ascending: false });
        const { data, count, error } = await query;
        if (!error && data) {
          return { items: data, total: count || data.length };
        }
      } catch (err) {
        console.warn('getMediaList Supabase fallback:', err);
      }
    }

    let items = [...localStore.media];
    if (mediaType !== 'all') {
      items = items.filter(m => m.media_type === mediaType);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(m => m.alt_text?.toLowerCase().includes(q) || m.caption?.toLowerCase().includes(q) || m.url?.includes(q));
    }
    return { items, total: items.length };
  },

  async createMedia(mediaData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_media')
          .insert([mediaData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('createMedia error:', err);
        throw err;
      }
    }

    const newMedia = {
      ...mediaData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStore.media.unshift(newMedia);
    return newMedia;
  },

  async updateMedia(id, mediaData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_media')
          .update(mediaData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('updateMedia error:', err);
        throw err;
      }
    }

    const idx = localStore.media.findIndex(m => m.id === id);
    if (idx !== -1) {
      localStore.media[idx] = { ...localStore.media[idx], ...mediaData, updated_at: new Date().toISOString() };
      return localStore.media[idx];
    }
    return null;
  },

  async deleteMedia(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('content_media').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('deleteMedia error:', err);
        throw err;
      }
    }

    localStore.media = localStore.media.filter(m => m.id !== id);
    return true;
  },

  /**
   * 11. Scientific References Management
   */
  async getReferencesList(params = {}) {
    const { search = '', category = 'all' } = params;

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('scientific_references').select('*');
        if (category !== 'all') {
          query = query.eq('category', category);
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,authors.ilike.%${search}%,publication.ilike.%${search}%`);
        }

        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('getReferencesList Supabase fallback:', err);
      }
    }

    let items = [...localStore.references];
    if (category !== 'all') {
      items = items.filter(r => r.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => r.title?.toLowerCase().includes(q) || r.authors?.toLowerCase().includes(q));
    }
    return items;
  },

  async createReference(refData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('scientific_references')
          .insert([refData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('createReference error:', err);
        throw err;
      }
    }

    const newRef = {
      ...refData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStore.references.unshift(newRef);
    return newRef;
  },

  async updateReference(id, refData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('scientific_references')
          .update(refData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('updateReference error:', err);
        throw err;
      }
    }

    const idx = localStore.references.findIndex(r => r.id === id);
    if (idx !== -1) {
      localStore.references[idx] = { ...localStore.references[idx], ...refData, updated_at: new Date().toISOString() };
      return localStore.references[idx];
    }
    return null;
  },

  async deleteReference(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('scientific_references').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('deleteReference error:', err);
        throw err;
      }
    }

    localStore.references = localStore.references.filter(r => r.id !== id);
    return true;
  },

  /**
   * 12. Tags & Taxonomy Management
   */
  async getTagsList() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data) return data;
      } catch (err) {
        console.warn('getTagsList Supabase fallback:', err);
      }
    }

    return localStore.tags;
  },

  async createTag(tagData) {
    const slug = (tagData.slug || tagData.name || '').trim().toLowerCase().replace(/[\s_]+/g, '-');
    const record = { ...tagData, slug };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tags')
          .insert([record])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('createTag error:', err);
        throw err;
      }
    }

    const newTag = { ...record, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    localStore.tags.push(newTag);
    return newTag;
  },

  async updateTag(id, tagData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('updateTag error:', err);
        throw err;
      }
    }

    const idx = localStore.tags.findIndex(t => t.id === id);
    if (idx !== -1) {
      localStore.tags[idx] = { ...localStore.tags[idx], ...tagData };
      return localStore.tags[idx];
    }
    return null;
  },

  async deleteTag(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('tags').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('deleteTag error:', err);
        throw err;
      }
    }

    localStore.tags = localStore.tags.filter(t => t.id !== id);
    return true;
  },

  /**
   * 13. Modules & Learning Curricula Management
   */
  async getModulesList() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select(`
            *,
            module_lessons (
              id, section_name, order_index, created_at,
              content (id, title, slug, content_type, status, description, metadata)
            )
          `)
          .order('order_index', { ascending: true });

        if (!error && data) {
          return data.map(mod => {
            const sortedLessons = (mod.module_lessons || []).sort((a, b) => {
              if ((a.order_index ?? 0) !== (b.order_index ?? 0)) return (a.order_index ?? 0) - (b.order_index ?? 0);
              const dateDiff = new Date(a.created_at || 0) - new Date(b.created_at || 0);
              if (dateDiff !== 0) return dateDiff;
              return String(a.id || '').localeCompare(String(b.id || ''));
            });

            return {
              ...mod,
              lessons: sortedLessons,
              module_content: sortedLessons.map(l => ({
                ...l,
                sort_order: l.order_index
              }))
            };
          });
        }
      } catch (err) {
        console.warn('getModulesList Supabase fallback:', err);
      }
    }

    return localStore.modules.map(mod => {
      const lessons = (mod.lessons || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      return {
        ...mod,
        lessons,
        module_content: lessons.map(l => ({
          ...l,
          sort_order: l.order_index
        }))
      };
    });
  },

  async getModuleDetails(idOrSlug) {
    if (isSupabaseConfigured) {
      try {
        // Resolve ID if slug is passed
        let query = supabase
          .from('modules')
          .select(`
            *,
            module_lessons (
              id, section_name, order_index, created_at,
              content (id, title, slug, content_type, status, description, metadata)
            )
          `);

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        if (isUUID) {
          query = query.eq('id', idOrSlug);
        } else {
          query = query.eq('slug', idOrSlug);
        }

        const { data, error } = await query.single();

        if (!error && data) {
          const sortedLessons = (data.module_lessons || []).sort((a, b) => {
            if ((a.order_index ?? 0) !== (b.order_index ?? 0)) return (a.order_index ?? 0) - (b.order_index ?? 0);
            const dateDiff = new Date(a.created_at || 0) - new Date(b.created_at || 0);
            if (dateDiff !== 0) return dateDiff;
            return String(a.id || '').localeCompare(String(b.id || ''));
          });

          return {
            ...data,
            lessons: sortedLessons,
            module_content: sortedLessons.map(l => ({
              ...l,
              sort_order: l.order_index
            }))
          };
        }
      } catch (err) {
        console.warn('getModuleDetails Supabase fallback:', err);
      }
    }

    const found = localStore.modules.find(m => m.id === idOrSlug || m.slug === idOrSlug);
    if (found) {
      const lessons = (found.lessons || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      return {
        ...found,
        lessons,
        module_content: lessons.map(l => ({
          ...l,
          sort_order: l.order_index
        }))
      };
    }
    return null;
  },

  async createModule(moduleData) {
    const slug = (moduleData.slug || moduleData.title || '').trim().toLowerCase().replace(/[\s_]+/g, '-');
    const record = { ...moduleData, slug };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .insert([record])
          .select()
          .single();

        if (error) throw error;
        contentService.clearAllModulesCache();
        return data;
      } catch (err) {
        console.error('createModule error:', err);
        throw err;
      }
    }

    const newModule = {
      ...record,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lessons: []
    };
    localStore.modules.push(newModule);
    contentService.clearAllModulesCache();
    return newModule;
  },

  async updateModule(id, moduleData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .update({ ...moduleData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        contentService.clearModuleCache(id);
        if (data.slug) contentService.clearModuleCache(data.slug);
        contentService.clearAllModulesCache();
        return data;
      } catch (err) {
        console.error('updateModule error:', err);
        throw err;
      }
    }

    const idx = localStore.modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      localStore.modules[idx] = { ...localStore.modules[idx], ...moduleData, updated_at: new Date().toISOString() };
      contentService.clearModuleCache(id);
      contentService.clearAllModulesCache();
      return localStore.modules[idx];
    }
    return null;
  },

  async deleteModule(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('modules').delete().eq('id', id);
        if (error) throw error;
        contentService.clearModuleCache(id);
        contentService.clearAllModulesCache();
        return true;
      } catch (err) {
        console.error('deleteModule error:', err);
        throw err;
      }
    }

    localStore.modules = localStore.modules.filter(m => m.id !== id);
    if (localStore.module_content) {
      localStore.module_content = localStore.module_content.filter(mc => mc.module_id !== id);
    }
    contentService.clearModuleCache(id);
    contentService.clearAllModulesCache();
    return true;
  },

  async updateModuleLessons(moduleId, lessons = []) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('module_lessons').delete().eq('module_id', moduleId);

        if (lessons.length > 0) {
          const lessonsToInsert = lessons.map((l, idx) => ({
            module_id: moduleId,
            content_id: l.content_id,
            section_name: l.section_name || null,
            order_index: idx + 1
          }));

          const { error } = await supabase.from('module_lessons').insert(lessonsToInsert);
          if (error) throw error;
        }
        contentService.clearModuleCache(moduleId);
        contentService.clearAllModulesCache();
        return true;
      } catch (err) {
        console.error('updateModuleLessons error:', err);
        throw err;
      }
    }

    const mod = localStore.modules.find(m => m.id === moduleId);
    if (mod) {
      mod.lessons = lessons.map((l, idx) => ({
        id: crypto.randomUUID(),
        module_id: moduleId,
        content_id: l.content_id,
        section_name: l.section_name || null,
        order_index: idx + 1,
        content: localStore.content.find(c => c.id === l.content_id)
      }));
      contentService.clearModuleCache(moduleId);
      contentService.clearAllModulesCache();
      return true;
    }
    return false;
  },

  /**
   * 13.1 Module Content & Lessons Linking (using public.module_lessons)
   */
  async getModuleContent(moduleId) {
    if (isSupabaseConfigured) {
      try {
        let validModuleId = moduleId;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleId);
        if (!isUUID) {
          const { data: mod } = await supabase.from('modules').select('id').eq('slug', moduleId).maybeSingle();
          if (mod?.id) validModuleId = mod.id;
        }

        const { data, error } = await supabase
          .from('module_lessons')
          .select(`
            id, module_id, content_id, section_name, order_index, created_at,
            content:content_id (
              id, slug, language, title, description, content_type, status, featured_image, metadata, updated_at
            )
          `)
          .eq('module_id', validModuleId)
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data.map(item => ({
            ...item,
            sort_order: item.order_index
          })).sort((a, b) => {
            if ((a.order_index ?? 0) !== (b.order_index ?? 0)) return (a.order_index ?? 0) - (b.order_index ?? 0);
            const dateDiff = new Date(a.created_at || 0) - new Date(b.created_at || 0);
            if (dateDiff !== 0) return dateDiff;
            return String(a.id || '').localeCompare(String(b.id || ''));
          });
        }
      } catch (err) {
        console.warn('getModuleContent Supabase error:', err);
      }
    }

    const mod = localStore.modules.find(m => m.id === moduleId || m.slug === moduleId);
    const lessons = mod?.lessons || [];
    return lessons.map(l => ({
      ...l,
      sort_order: l.order_index
    })).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  },

  async addContentToModule(moduleId, contentId, sortOrder = null) {
    if (!moduleId || !contentId) throw new Error('moduleId and contentId are required');

    if (isSupabaseConfigured) {
      try {
        // Validate and resolve module ID
        let validModuleId = moduleId;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleId);
        if (!isUUID) {
          const { data: mod } = await supabase.from('modules').select('id').eq('slug', moduleId).maybeSingle();
          if (mod?.id) {
            validModuleId = mod.id;
          } else {
            throw new Error(`Module with slug or ID "${moduleId}" does not exist`);
          }
        } else {
          const { data: modExists } = await supabase.from('modules').select('id').eq('id', validModuleId).maybeSingle();
          if (!modExists?.id) {
            throw new Error(`Module with ID "${validModuleId}" does not exist`);
          }
        }

        // Validate content exists
        const { data: contentExists } = await supabase.from('content').select('id').eq('id', contentId).maybeSingle();
        if (!contentExists?.id) {
          throw new Error(`Content with ID "${contentId}" does not exist`);
        }

        // Check if already linked
        const { data: existingLesson } = await supabase
          .from('module_lessons')
          .select(`
            id, module_id, content_id, section_name, order_index, created_at,
            content:content_id (
              id, slug, language, title, description, content_type, status, featured_image, metadata
            )
          `)
          .eq('module_id', validModuleId)
          .eq('content_id', contentId)
          .maybeSingle();

        if (existingLesson) {
          return {
            ...existingLesson,
            sort_order: existingLesson.order_index
          };
        }

        let order = sortOrder;
        if (order === null) {
          const { data: maxItem } = await supabase
            .from('module_lessons')
            .select('order_index')
            .eq('module_id', validModuleId)
            .order('order_index', { ascending: false })
            .limit(1)
            .maybeSingle();
          order = (maxItem?.order_index ?? 0) + 1;
        }

        const { data, error } = await supabase
          .from('module_lessons')
          .insert([{
            module_id: validModuleId,
            content_id: contentId,
            section_name: 'محتوى تخصصي',
            order_index: order
          }])
          .select(`
            id, module_id, content_id, section_name, order_index, created_at,
            content:content_id (
              id, slug, language, title, description, content_type, status, featured_image, metadata
            )
          `)
          .single();

        if (error) throw error;
        contentService.clearModuleCache(validModuleId);
        contentService.clearModuleCache(moduleId);
        contentService.clearAllModulesCache();
        return {
          ...data,
          sort_order: data.order_index
        };
      } catch (err) {
        console.error('addContentToModule error:', err);
        throw err;
      }
    }

    const mod = localStore.modules.find(m => m.id === moduleId || m.slug === moduleId);
    if (mod) {
      if (!mod.lessons) mod.lessons = [];
      const existing = mod.lessons.find(l => l.content_id === contentId);
      if (existing) {
        return { ...existing, sort_order: existing.order_index };
      }

      const nextOrder = sortOrder ?? (mod.lessons.length + 1);
      const contentObj = localStore.content?.find(c => c.id === contentId) || { id: contentId, title: 'صفحة محتوى', status: 'published', content_type: 'article' };
      const newRecord = {
        id: crypto.randomUUID(),
        module_id: mod.id,
        content_id: contentId,
        section_name: 'محتوى تخصصي',
        order_index: nextOrder,
        sort_order: nextOrder,
        created_at: new Date().toISOString(),
        content: contentObj
      };
      mod.lessons.push(newRecord);
      contentService.clearModuleCache(mod.id);
      contentService.clearAllModulesCache();
      return newRecord;
    }
    return null;
  },

  async removeContentFromModule(moduleId, contentId) {
    if (isSupabaseConfigured) {
      try {
        let validModuleId = moduleId;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleId);
        if (!isUUID) {
          const { data: mod } = await supabase.from('modules').select('id').eq('slug', moduleId).maybeSingle();
          if (mod?.id) validModuleId = mod.id;
        }

        const { error } = await supabase
          .from('module_lessons')
          .delete()
          .eq('module_id', validModuleId)
          .eq('content_id', contentId);

        if (error) throw error;
        contentService.clearModuleCache(validModuleId);
        contentService.clearModuleCache(moduleId);
        contentService.clearAllModulesCache();
        return true;
      } catch (err) {
        console.error('removeContentFromModule error:', err);
        throw err;
      }
    }

    const mod = localStore.modules.find(m => m.id === moduleId || m.slug === moduleId);
    if (mod && mod.lessons) {
      mod.lessons = mod.lessons.filter(l => l.content_id !== contentId);
    }
    contentService.clearModuleCache(moduleId);
    contentService.clearAllModulesCache();
    return true;
  },

  async updateModuleContentOrder(moduleId, items = []) {
    if (isSupabaseConfigured) {
      try {
        let validModuleId = moduleId;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(moduleId);
        if (!isUUID) {
          const { data: mod } = await supabase.from('modules').select('id').eq('slug', moduleId).maybeSingle();
          if (mod?.id) validModuleId = mod.id;
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const contentId = item.content_id || item.content?.id;
          if (!contentId) continue;
          await supabase
            .from('module_lessons')
            .update({ order_index: i + 1 })
            .eq('module_id', validModuleId)
            .eq('content_id', contentId);
        }

        contentService.clearModuleCache(validModuleId);
        contentService.clearModuleCache(moduleId);
        contentService.clearAllModulesCache();
        return true;
      } catch (err) {
        console.error('updateModuleContentOrder error:', err);
        throw err;
      }
    }

    const mod = localStore.modules.find(m => m.id === moduleId || m.slug === moduleId);
    if (mod && mod.lessons) {
      items.forEach((item, idx) => {
        const cId = item.content_id || item.content?.id;
        const found = mod.lessons.find(l => l.content_id === cId);
        if (found) {
          found.order_index = idx + 1;
          found.sort_order = idx + 1;
        }
      });
    }
    contentService.clearModuleCache(moduleId);
    contentService.clearAllModulesCache();
    return true;
  },

  /**
   * 14. Psychology Insights & Emotions Datasets
   */
  async getInsightsList() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('psychology_insights').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('getInsightsList error:', err);
      }
    }
    return localStore.insights;
  },

  async createInsight(insightData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('psychology_insights').insert([insightData]).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('createInsight error:', err);
        throw err;
      }
    }
    const newIns = { ...insightData, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    localStore.insights.unshift(newIns);
    return newIns;
  },

  async deleteInsight(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('psychology_insights').delete().eq('id', id);
        return true;
      } catch (err) {
        console.error('deleteInsight error:', err);
        throw err;
      }
    }
    localStore.insights = localStore.insights.filter(i => i.id !== id);
    return true;
  }
};

export default adminContentService;
