# CONTENT SYSTEM ARCHITECTURE & LIFECYCLE (دليل معمارية المحتوى والدورة الكاملة)

> يشرح هذا الدليل دورة حياة المحتوى بالكامل في النظام، وكيفية الفصل التام بين المحتوى السحابي (Database Content) والمنطق البرمجي التفاعلي في React، بالإضافة إلى آليات الصفحات الهجينة (Hybrid Pages) وحماية التنسيقات (Scoped CSS).

---

## 1. الدورة الكاملة لإنشاء وعرض المحتوى (End-to-End Lifecycle)

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. مرحلة الإدخال والتحرير (Admin Content Studio)              │
│    - المشرف يدخل العنوان، المقال (Markdown)، والوسائط         │
│    - يحدد كتل المكونات التفاعلية وأماكن الظهور (Slots)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. الحفظ والإصدارات (Supabase Database Storage)             │
│    - حفظ المحتوى في جدول `content`                          │
│    - تفكيك الكتل وحفظها في `content_blocks`                 │
│    - إنشاء لقطة في `content_versions` لأغراض التراجع        │
│    - ربط المراجع والوسائط والوسوم في جداول الربط             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. طبقة الخدمة والـ Cache في React (`contentService.js`)     │
│    - جلب البيانات المنشورة عبر Supabase Query               │
│    - تفعيل التخزين المؤقت في الذاكرة (In-Memory / Local Cache) │
│    - توفير دوال مثل: `getContentBySlug(slug)`, `getSlots()` │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. محرك القوالب والتصيير (`TemplateRegistry.jsx`)            │
│    - تحديد القالب المناسب حسب نوع المحتوى أو الإعدادات      │
│    - (ArticleTemplate, ModuleTemplate, MinimalTemplate)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. المعالج والـ Scoped CSS (`MarkdownRenderer.jsx`)          │
│    - تحويل Markdown إلى عناصر React نظيفة                   │
│    - تطبيق CSS المحصور داخل نطاق المعرف `.content-[id]`      │
│    - حقن المكونات التفاعلية بدقة في مواقعها المحددة          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. واجهة المستخدم النهائية (Rendered Final UI)               │
│    - الصفحة جاهزة للمستخدم بكامل السرعة والتفاعلية          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. معمارية الصفحات الهجينة (Hybrid Pages Architecture)

### المشكلة:
في صفحات مثل `ACTSkills.jsx`, `DBTTipp.jsx`, `SFBTSkills.jsx`:
- تحتوي الصفحة على **مادة معرفية علمية** (شرح، استعارات، مراجع، نصوص أسئلة).
- وفي نفس الوقت تحتوي على **محرك تفاعلي برمجي معقد** (مؤقت ثوانٍ، رسوم متحركة، عداد تنفس، سلايدر مقاييس، حفظ محلي).

### الحل المعماري المعتمد:
1. **قاعدة البيانات (Database):** مسؤولة حصرياً عن النصوص والشروح والميتا داتا وتكوين المكون التفاعلي:
   ```json
   {
     "block_type": "interactive_component",
     "payload": {
       "component": "tipp-cold-water-timer",
       "props": {
         "defaultDuration": 30,
         "showDistressScale": true
       }
     }
   }
   ```
2. **شفرة React (`src/components/`):** تحتفظ بجميع ملفات المكونات التفاعلية الخالصة، وتُسجَّل داخل سجل المكونات التفاعلية:
   ```javascript
   // src/components/interactive/InteractiveRegistry.jsx
   import ColdWaterTimer from './ColdWaterTimer';
   import DefusionCardCreator from './DefusionCardCreator';
   import ThoughtRecordWizard from './ThoughtRecordWizard';
   import Breathing478 from '../../pages/Breathing478';

   export const COMPONENT_MAP = {
     'tipp-cold-water-timer': ColdWaterTimer,
     'defusion-card-creator': DefusionCardCreator,
     'thought-record-wizard': ThoughtRecordWizard,
     'breathing-478': Breathing478,
   };
   ```
3. **التجميع والعرض (Rendering Pipeline):**
   يقوم `MarkdownRenderer` أو `HybridPageRenderer` بقراءة الكتل بالترتيب:
   - عندما تكون الكتلة `markdown`: يصيّر النص العادي.
   - عندما تكون الكتلة `interactive_component`: يستدعي المكون المطابق من `COMPONENT_MAP` ويمرر له الـ `props` من قاعدة البيانات.

---

## 3. حماية وتأمين الـ CSS المخصص (Scoped CSS Isolation)

لمنع كسر الموقع أو تداخل تنسيقات المحتوى مع شريط التنقل أو القوائم العامة:

1. **تغليف حاوية المقال بمعرف فريد:**
   ```jsx
   <article id={`content-article-${content.id}`} className={`content-scope content-${content.slug}`}>
     {/* المحتوى المعروض */}
   </article>
   ```

2. **معالجة الـ CSS في الـ Renderer:**
   يتم تمرير كود الـ CSS المخصص عبر دالة حصر (Scoper Function) تضمن أن كل قاعدة CSS تسبق بالمعرف `#content-article-[id]`:
   ```javascript
   function scopeCSS(rawCss, scopeId) {
     if (!rawCss) return '';
     // تحويل .card { color: red; } إلى #content-article-xyz .card { color: red; }
     return rawCss.replace(/(^|})\s*([^{]+)/g, (match, prefix, selector) => {
       const trimmed = selector.trim();
       if (!trimmed || trimmed.startsWith('@')) return match;
       return `${prefix} #${scopeId} ${trimmed}`;
     });
   }
   ```
   **النتيجة:** لا يمكن لأي كود CSS مخزن في قاعدة البيانات التأثير على عناصر `body`, `nav`, `footer`, أو بقية أجزاء النظام.

---

## 4. نظام توزيع الأماكن الديناميكي (Slot Placement Engine)

من خلال جدول `content_locations`:
- يمكن لمكون الصفحة الرئيسية `Home.jsx` طلب محتويات الـ `slot = "featured"` ديناميكياً:
  ```javascript
  const featuredContents = await contentService.getContentsByLocation('/home', 'featured');
  ```
- يمكن للمشرف تبديل المقال المعروض في الصفحة الرئيسية أو البانر العلوي بضغطة زر من لوحة الإدارة بتغيير سجل في `content_locations` دون الحاجة لكتابة أو رفع كود جديد.

---

## 5. جاهزية الذكاء الاصطناعي والبحث (AI & Search Integration Readiness)

1. **حقل `plain_text` في `content`:**
   - يتيح لمساعد الذكاء الاصطناعي (Gemini AI Chat) وفهرس البحث البحث السريع في المعرفة النفسية مباشرة عبر استعلامات نصية فائقة السرعة أو Vector Embeddings.
2. **فهرسة آلية:**
   - عند حفظ أي محتوى من لوحة الإدارة، يتم استخراج النص المجرد تلقائياً من الـ Markdown وتخزينه في `plain_text` لتحديث نتائج البحث فوراً.
