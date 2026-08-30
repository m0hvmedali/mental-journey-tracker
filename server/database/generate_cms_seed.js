// server/database/generate_cms_seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MODULES_DATA } from '../../src/data/modulesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read Emotions
const emotionsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/emotions_details.json'), 'utf8'));

// 2. Read Insights
const insightsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/psychology_insights_dataset.json'), 'utf8'));

// 3. Extract References
const refranceCode = fs.readFileSync(path.join(__dirname, '../../src/pages/Refrance.jsx'), 'utf8');
const referencesRaw = [];
const refEntries = refranceCode.split(/\{\s*name:\s*/);
refEntries.shift();
for (const entry of refEntries) {
  const nameMatch = entry.match(/^["'`\x27]([^"'`\x27]+)["'`\x27]/);
  const linkMatch = entry.match(/link:\s*["'`\x27]([^"'`\x27]+)["'`\x27]/);
  const catMatch = entry.match(/category:\s*["'`\x27]([^"'`\x27]+)["'`\x27]/);
  if (nameMatch) {
    referencesRaw.push({
      name: nameMatch[1].trim(),
      link: linkMatch ? linkMatch[1].trim() : '',
      category: catMatch ? catMatch[1].trim() : 'عام'
    });
  }
}

console.log(`Parsed Datasets:
- ${emotionsRaw.length} Emotions
- ${insightsRaw.length} Insights
- ${MODULES_DATA.length} Modules (${MODULES_DATA.reduce((acc, m) => acc + (m.pages?.length || 0), 0)} lessons)
- ${referencesRaw.length} Scientific References
`);

// Build SQL Migration File
let sql = `-- ============================================================================
-- FULL CONTENT MIGRATION SEED
-- Generated automatically for Phase 4 Migration
-- ============================================================================

`;

// 1. SEED SCIENTIFIC REFERENCES
sql += `-- 1. SCIENTIFIC REFERENCES (${referencesRaw.length} items)\n`;
referencesRaw.forEach((ref, idx) => {
  const safeTitle = ref.name.replace(/'/g, "''");
  const safeUrl = ref.link.replace(/'/g, "''");
  const safeCategory = ref.category.replace(/'/g, "''");
  const uuid = `10000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;
  sql += `INSERT INTO public.scientific_references (id, title, url, category) VALUES ('${uuid}', '${safeTitle}', '${safeUrl}', '${safeCategory}') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, url = EXCLUDED.url, category = EXCLUDED.category;\n`;
});
sql += `\n`;

// 2. SEED TAGS
const tagsList = [
  { name: 'العلاج المعرفي السلوكي', slug: 'cbt', cat: 'Therapy Framework' },
  { name: 'العلاج بالقبول والالتزام', slug: 'act', cat: 'Therapy Framework' },
  { name: 'العلاج الجدلي السلوكي', slug: 'dbt', cat: 'Therapy Framework' },
  { name: 'العلاج المركّز على الحلول', slug: 'sfbt', cat: 'Therapy Framework' },
  { name: 'العلاج النفسي الديناميكي', slug: 'psychodynamic', cat: 'Therapy Framework' },
  { name: 'تنظيم المشاعر', slug: 'emotional-regulation', cat: 'Core Skill' },
  { name: 'اليقظة الذهنية', slug: 'mindfulness', cat: 'Core Skill' },
  { name: 'الشفقة بالذات', slug: 'self-compassion', cat: 'Core Skill' },
  { name: 'العلاقات والتعلق', slug: 'attachment', cat: 'Interpersonal' },
  { name: 'التشوهات المعرفية', slug: 'cognitive-distortions', cat: 'Cognitive' }
];

sql += `-- 2. TAGS\n`;
tagsList.forEach((t, idx) => {
  const tagUuid = `44444444-4444-4444-4444-${String(idx + 1).padStart(12, '0')}`;
  sql += `INSERT INTO public.tags (id, name, slug, category) VALUES ('${tagUuid}', '${t.name}', '${t.slug}', '${t.cat}') ON CONFLICT (slug) DO NOTHING;\n`;
});
sql += `\n`;

// 3. SEED EMOTIONS ENCYCLOPEDIA
sql += `-- 3. EMOTIONS ENCYCLOPEDIA (${emotionsRaw.length} items)\n`;
emotionsRaw.forEach((emo, idx) => {
  const emoKey = (emo.english_name || emo.name || `emotion-${idx}`).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const safeName = (emo.name || '').replace(/'/g, "''");
  const safeCategory = (emo.family || 'عام').replace(/'/g, "''");
  const safeDef = (emo.definition || '').replace(/'/g, "''");
  const sensationsJson = JSON.stringify(emo.bodily_expression?.effects_on_body || []).replace(/'/g, "''");
  const triggersJson = JSON.stringify(emo.triggers || []).replace(/'/g, "''");
  const expressionsJson = JSON.stringify(emo.coping_strategies || emo.healthy_expressions || []).replace(/'/g, "''");
  const metadataJson = JSON.stringify({
    english_name: emo.english_name,
    type: emo.type,
    primary_emotion: emo.primary_emotion,
    origin_body_part: emo.bodily_expression?.origin
  }).replace(/'/g, "''");
  const uuid = `20000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;

  sql += `INSERT INTO public.emotions_encyclopedia (id, emotion_key, arabic_name, category, intensity_level, definition, body_sensations, triggers, healthy_expressions, metadata)
VALUES ('${uuid}', '${emoKey || 'emo-' + idx}', '${safeName}', '${safeCategory}', 2, '${safeDef}', '${sensationsJson}'::jsonb, '${triggersJson}'::jsonb, '${expressionsJson}'::jsonb, '${metadataJson}'::jsonb)
ON CONFLICT (emotion_key) DO UPDATE SET arabic_name = EXCLUDED.arabic_name, category = EXCLUDED.category, definition = EXCLUDED.definition, body_sensations = EXCLUDED.body_sensations, triggers = EXCLUDED.triggers, healthy_expressions = EXCLUDED.healthy_expressions, metadata = EXCLUDED.metadata;\n`;
});
sql += `\n`;

// 4. SEED PSYCHOLOGY INSIGHTS
sql += `-- 4. PSYCHOLOGY INSIGHTS (${insightsRaw.length} items)\n`;
insightsRaw.forEach((ins, idx) => {
  const safeText = (ins.text || '').replace(/'/g, "''");
  const safeAuthor = (ins.author || 'دليل الوعي النفسي').replace(/'/g, "''");
  const safeTopic = (ins.topic || 'عام').replace(/'/g, "''");
  const isFeatured = idx < 10;
  const uuid = `30000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;

  sql += `INSERT INTO public.psychology_insights (id, insight_text, author_or_source, topic, evidence_level, is_featured)
VALUES ('${uuid}', '${safeText}', '${safeAuthor}', '${safeTopic}', 'evidence-based', ${isFeatured})
ON CONFLICT (id) DO UPDATE SET insight_text = EXCLUDED.insight_text, author_or_source = EXCLUDED.author_or_source, topic = EXCLUDED.topic, is_featured = EXCLUDED.is_featured;\n`;
});
sql += `\n`;

// 5. SEED STANDALONE SCIENTIFIC PAGES (Thinking Errors, Defense Mechanisms, Tolerance Window, About)
sql += `-- 5. STANDALONE SCIENTIFIC ARTICLES\n`;

const standaloneArticles = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    slug: 'thinking-errors',
    title: 'التشوهات المعرفية (Thinking Errors)',
    desc: 'دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها وفق أساليب العلاج المعرفي السلوكي (CBT).',
    type: 'scientific_page',
    image: '/article-by3DYy7JylaR.webp',
    readingTime: 7,
    framework: 'CBT',
    markdown: `# دليل التشوهات المعرفية (Cognitive Distortions)

التشوهات المعرفية هي أنماط تفكير تلقائية غير عقلانية تجعلنا نرى الواقع بصورة مشوهة أو متطرفة. تحدث هذه الأفكار في أجزاء من الثانية وتؤدي مباشرة إلى مشاعر سلبية حادة مثل القلق، الحزن، الذنب، أو الإحباط.

:::note
**ملاحظة إكلينيكية:**
الهدف من رصد التشوهات المعرفية ليس منع الأفكار من الظهور، بل التراجع خطوة للخلف وملاحظتها كأفكار عابرة وليست حقائق قاطعة.
:::

## 1. التفكير بالأبيض والأسود (All-or-Nothing Thinking)
رؤية الأمور في قطبين متطرفين دون أي مساحات رمادية: إما نجاح تام أو فشل ذريع.

## 2. التعميم المفرط (Overgeneralization)
اعتبار تجربة سلبية واحدة دليلاً قاطعاً على نمط دائم في الحياة باستخدام كلمات مثل "دائماً" أو "أبداً".

## 3. التصفية الذهنية (Mental Filter)
التركيز على تفصيلة سلبية واحدة وتجاهل كل ما هو إيجابي في الموقف.

## 4. القفز إلى الاستنتاجات (Jumping to Conclusions)
* **قراءة الأفكار (Mind Reading):** افتراض معرفة ما يفكر فيه الآخرون بسوء ظن.
* **التنبؤ الكارثي (Fortune Telling):** توقع حدوث أسوأ السيناريوهات والتصرف كأنها حتمية.`,
    blocks: [
      {
        id: 'blk-te-1',
        block_type: 'markdown',
        position: 1,
        payload: { content: '### تمرين تفاعلي موجه: سجل الأفكار المعرفية\nاستخدم الأداة أدناه لتطبيق مهارات إعادة الهيكلة المعرفية على فكرة تراودك حالياً:' }
      },
      {
        id: 'blk-te-2',
        block_type: 'interactive_component',
        position: 2,
        payload: { component: 'thought-record-wizard', props: { initialDistortion: 'allOrNothing', mode: 'guided' } },
        metadata: { title: 'معالج رصد وتفنيد الفكرة التلقائية' }
      },
      {
        id: 'blk-te-3',
        block_type: 'interactive_component',
        position: 3,
        payload: { component: 'distortion-quiz', props: {} },
        metadata: { title: 'اختبار تشخيص الأخطاء المعرفية' }
      }
    ]
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    slug: 'defense-mechanisms',
    title: 'آليات الدفاع النفسي (Defense Mechanisms)',
    desc: 'دليل شامل لآليات الدفاع النفسي اللاشعورية من منظور التحليل النفسي وسيكولوجيا الأنا، وكيفية التمييز بين الآليات الناضجة وغير الناضجة.',
    type: 'scientific_page',
    image: '/DfenssImg/hero.webp',
    readingTime: 8,
    framework: 'Psychodynamic',
    markdown: `# آليات الدفاع النفسي (Ego Defense Mechanisms)

آليات الدفاع النفسي هي استراتيجيات نفسية لاشعورية يستخدمها العقل لحماية الذات من القلق والتهديدات النفسية والصراعات الداخلية بين الرغبات الغريزية والقيم الأخلاقية.

## تصنيف آليات الدفاع (George Vaillant Hierarchy)

### 1. الدفاعات الناضجة (Mature Defenses)
* **التسامي (Sublimation):** تحويل الدوافع غير المقبولة إلى أنشطة إبداعية واجتماعية بناءة.
* **الفكاهة (Humor):** التعبير عن المشاعر الصعبة بطريقة مرحة تخفف من حدة التوتر.
* **الإيثار (Altruism):** تقديم العون للآخرين لاكتساب شعور حقيقي بالمعنى والرضا.

### 2. الدفاعات العصابية (Neurotic Defenses)
* **الكبت (Repression):** إزاحة الأفكار والذكريات المؤلمة إلى اللاوعي.
* **التبرير (Rationalization):** اختلاق أسباب منطقية ظاهرياً لسلوكيات أو مشاعر غير مقبولة.
* **الإزاحة (Displacement):** تفريغ الانفعال على شخص أو شيء أقل تهديداً.

### 3. الدفاعات غير الناضجة والبدائية (Immature Defenses)
* **الإسقاط (Projection):** نسبة رغباتك أو عيوبك المرفوضة إلى الآخرين.
* **الإنكار (Denial):** رفض الاعتراف بوجود واقع مؤلم وملموس.
* **الانشطار (Splitting):** رؤية الأشخاص كأخيار مطلقين أو أشرار مطلقين.`,
    blocks: [
      {
        id: 'blk-dm-1',
        block_type: 'quote',
        position: 1,
        payload: {
          quote: 'الأنا ليست سيدة في بيتها الخاص ما لم تدرك ما يدور في أعماق لاوعيها.',
          author: 'سيغموند فرويد'
        }
      }
    ]
  },
  {
    id: '55555555-5555-5555-5555-555555555553',
    slug: 'tolerance-window',
    title: 'نافذة التحمل العصبي (Window of Tolerance)',
    desc: 'فهم السعة المثلى للجهاز العصبي لتنظيم المشاعر وكيفية التعامل مع حالات فرط الاستثارة وانخفاض الاستثارة.',
    type: 'scientific_page',
    image: '/window-of-tolerance.webp',
    readingTime: 6,
    framework: 'Somatic / Polyvagal',
    markdown: `# نافذة التحمل العصبي (Window of Tolerance)

مفهوم وضعه الدكتور دان سيغل (Dan Siegel) لوصف النطاق الفسيولوجي والعاطفي الذي نستطيع فيه استقبال الضغوط اليومية والتعامل معها بكفاءة وتوازن دون أن يفقد الجهاز العصبي قدرته على التنظيم.

## مناطق الجهاز العصبي الثلاث:

### 1. منطقة فرط الاستثارة (Hyperarousal) - القتال أو الهروب (Fight or Flight)
* تسارع ضربات القلب، توتر العضلات، الغضب، الهلع، والأفكار المتسارعة.
* **العلاج الأنسب:** مهارات TIPP (الماء البارد، التنفس البطيء الزفير الأطول).

### 2. النافذة المثلى (Optimal Zone) - الاتصال والأمان (Ventral Vagal)
* القدرة على التفكير بمرونة، التواصل الاجتماعي، والتعلم والتعاطف.

### 3. منطقة انخفاض الاستثارة (Hypoarousal) - التجمد والانغلاق (Freeze / Shutdown)
* التبلد، انعدام الطاقة، الخدر العاطفي، والانفصال عن الواقع.
* **العلاج الأنسب:** التنشيط الحسي اللطيف والحركة البدنية التدريجية.`,
    blocks: [
      {
        id: 'blk-tw-1',
        block_type: 'interactive_component',
        position: 1,
        payload: { component: 'breathing-circle', props: { mode: '4-7-8' } },
        metadata: { title: 'تمرين التنفس لإعادة الجهاز العصبي إلى النافذة' }
      }
    ]
  },
  {
    id: '55555555-5555-5555-5555-555555555554',
    slug: 'about',
    title: 'عن منصة الوعي والتعافي النفسي',
    desc: 'الرؤية العلمية، الأهداف السريرية، وميثاق الأمان والخصوصية للمنصة.',
    type: 'about',
    image: '/about-hero.webp',
    readingTime: 4,
    framework: 'Clinical Psychology',
    markdown: `# عن منصة الوعي والتعافي النفسي

تطبيق تفاعلي مبني على أحدث الأدلة والبراهين السريرية المعتمدة في علم النفس الإكلينيكي والعلاج النفسي الحديث، يهدف إلى تمكين المستخدم من فهم جهازه العصبي وتنظيم مشاعره بوعي ومرونة.

## المدارس العلاجية المدمجة في المنصة:
* **CBT:** العلاج المعرفي السلوكي وتفنيد الأفكار التلقائية.
* **ACT:** العلاج بالقبول والالتزام والاتصال بالقيم.
* **DBT:** العلاج الجدلي السلوكي وتنظيم الانفعال الحاد وتحمل الضغوط.
* **SFBT:** العلاج المركّز على الحلول واستكشاف الاستثناءات.
* **النظرية العصبية المتعددة (Polyvagal Theory):** تنظيم الاستثارة الفسيولوجية للجهاز العصبي.

## ميثاق الخصوصية والأمان:
* جميع البيانات والمدخلات السريرية واليوميات مشفرة وآمنة تماماً.
* التطبيق أداة إرشادية وتدريبية ولا يُغني عن الاستشارة الطبية المتخصصة في الحالات الطارئة.`,
    blocks: []
  }
];

standaloneArticles.forEach(art => {
  const safeTitle = art.title.replace(/'/g, "''");
  const safeDesc = art.desc.replace(/'/g, "''");
  const safeMd = art.markdown.replace(/'/g, "''");
  const metaJson = JSON.stringify({
    reading_time_minutes: art.readingTime,
    framework: art.framework
  }).replace(/'/g, "''");

  sql += `INSERT INTO public.content (id, slug, language, title, description, content_type, status, markdown_content, featured_image, metadata, published_at)
VALUES ('${art.id}', '${art.slug}', 'ar', '${safeTitle}', '${safeDesc}', '${art.type}', 'published', '${safeMd}', '${art.image}', '${metaJson}'::jsonb, NOW())
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, markdown_content = EXCLUDED.markdown_content, featured_image = EXCLUDED.featured_image, metadata = EXCLUDED.metadata;\n`;

  if (art.blocks && art.blocks.length > 0) {
    art.blocks.forEach(b => {
      const bUuid = `80000000-0000-0000-0000-${b.id.replace(/[^0-9]/g, '').padStart(12, '0') || '000000000001'}`;
      const payloadJson = JSON.stringify(b.payload || {}).replace(/'/g, "''");
      const blockMetaJson = JSON.stringify(b.metadata || {}).replace(/'/g, "''");
      sql += `INSERT INTO public.content_blocks (id, content_id, block_type, position, payload, metadata)
VALUES ('${bUuid}', '${art.id}', '${b.block_type}', ${b.position}, '${payloadJson}'::jsonb, '${blockMetaJson}'::jsonb)
ON CONFLICT (id) DO NOTHING;\n`;
    });
  }
});
sql += `\n`;

// 6. SEED MODULES & LESSONS
sql += `-- 6. MODULES AND LESSONS\n`;
MODULES_DATA.forEach((mod, modIdx) => {
  const modUuid = `40000000-0000-0000-0000-${String(modIdx + 1).padStart(12, '0')}`;
  const safeTitle = (mod.title || '').replace(/'/g, "''");
  const safeDesc = (mod.overview || mod.tagline || '').replace(/'/g, "''");
  const safeHero = (mod.hero || '').replace(/'/g, "''");
  const modMeta = JSON.stringify({
    id: mod.id,
    tagline: mod.tagline,
    objectives: mod.objectives
  }).replace(/'/g, "''");

  sql += `INSERT INTO public.modules (id, slug, title, description, order_index, background_image, status, metadata)
VALUES ('${modUuid}', '${mod.slug}', '${safeTitle}', '${safeDesc}', ${modIdx + 1}, '${safeHero}', 'published', '${modMeta}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, background_image = EXCLUDED.background_image, metadata = EXCLUDED.metadata;\n`;

  // Lessons
  if (mod.pages && Array.isArray(mod.pages)) {
    mod.pages.forEach((page, pageIdx) => {
      const contentUuid = `50000000-0000-0000-${String(modIdx + 1).padStart(4, '0')}-${String(pageIdx + 1).padStart(12, '0')}`;
      const lessonUuid = `60000000-0000-0000-${String(modIdx + 1).padStart(4, '0')}-${String(pageIdx + 1).padStart(12, '0')}`;
      const safePageTitle = (page.title || '').replace(/'/g, "''");
      const safeSubtitle = (page.subtitle || '').replace(/'/g, "''");
      const safeCategory = (page.category || mod.title || '').replace(/'/g, "''");
      const pageMeta = JSON.stringify({
        moduleId: mod.id,
        moduleSlug: mod.slug,
        readTime: page.readTime,
        category: page.category,
        tabs: page.tabs,
        exercises: page.exercises
      }).replace(/'/g, "''");

      // Content item for the lesson
      sql += `INSERT INTO public.content (id, slug, language, title, description, content_type, status, metadata, published_at)
VALUES ('${contentUuid}', '${page.slug || 'lesson-' + mod.id + '-' + page.id}', 'ar', '${safePageTitle}', '${safeSubtitle}', 'lesson', 'published', '${pageMeta}'::jsonb, NOW())
ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, metadata = EXCLUDED.metadata;\n`;

      // Module lesson join
      sql += `INSERT INTO public.module_lessons (id, module_id, content_id, section_name, order_index)
VALUES ('${lessonUuid}', '${modUuid}', '${contentUuid}', '${safeCategory}', ${pageIdx + 1})
ON CONFLICT (id) DO UPDATE SET section_name = EXCLUDED.section_name, order_index = EXCLUDED.order_index;\n`;
    });
  }
});
sql += `\n`;

// 7. SEED HOME LOCATIONS
sql += `-- 7. CONTENT LOCATIONS FOR HOME & DISCOVERY\n`;
sql += `INSERT INTO public.content_locations (id, content_id, page_route, slot, order_index, is_visible)
VALUES 
  ('70000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555551', '/home', 'featured', 1, true),
  ('70000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555551', '/ThinkingErrors', 'main_body', 1, true),
  ('70000000-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555552', '/DefenseMechanisms', 'main_body', 1, true),
  ('70000000-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555553', '/ToleranceWindow', 'main_body', 1, true)
ON CONFLICT (id) DO NOTHING;\n`;

const outPath = path.join(__dirname, '../../supabase/migrations/20260830_full_content_migration_seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Successfully generated SQL seed file at:', outPath);
