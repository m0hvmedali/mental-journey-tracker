# CONTENT MIGRATION PLAN — خطة ترحيل المحتوى المستقبلية

> هذه الوثيقة تقدم تحليلاً إحصائياً دقيقاً، وترتيباً استراتيجياً مقترحاً لعملية ترحيل المحتوى إلى قاعدة البيانات مستقبلاً دون المساس بالأداء أو المنطق التفاعلي.

---

## 1. الإحصائيات والأرقام الرئيسية (Key Metrics)

| البند / المؤشر | العدد | التفاصيل |
| :--- | :--- | :--- |
| **إجمالي مرشحات المحتوى (Content Candidates)** | **8 ملفات رئيسية** | `modulesData.js`, `emotions_details.json`, `psychology_insights_dataset.json`, `ThinkingErrors.jsx`, `DefenseMechanisms.jsx`, `ToleranceWindow.jsx`, `Refrance.jsx`, `About.jsx` |
| **الصفحات والمكونات التفاعلية الخالصة (Interactive Pages)** | **10 صفحات** | `Wheel.jsx`, `Breathing478.jsx`, `Diary.jsx`, `Progress.jsx`, `EmotionSelect.jsx`, `Community.jsx`, `Settings.jsx`, `Login.jsx`, `ContentManager.jsx`, `ContentEditor.jsx` |
| **الصفحات الهجينة (Hybrid Pages)** | **9 صفحات** | `ACTSkills.jsx`, `DBTTipp.jsx`, `CognitiveReappraisal.jsx`, `EmotionalRegulation.jsx`, `SuppressionVsRegulation.jsx`, `PsychodynamicSkills.jsx`, `SFBTSkills.jsx`, `SelfCompassion.jsx`, `RelationshipDynamics.jsx` |
| **مصادر محتوى JSON (JSON Content Sources)** | **4 ملفات** | `emotions_details.json`, `psychology_insights_dataset.json`, `ar.json`, `en.json` |
| **مصادر محتوى JS / JSX (JS/JSX Content Sources)** | **14 ملفاً** | `modulesData.js`, `pagesKnowledge.js`, `searchIndex.js`, بالإضافة إلى 11 صفحة تحتوي على نصوص سيكولوجية مدمجة |
| **إجمالي الصور والوسائط الرقمية (Images & Media)** | **32+ صورة** | 4 خلفيات مسارات، 16 صورة أخطاء معرفية، 10 صور آليات دفاع، شعارات وأيقونات أساسية |

---

## 2. الترتيب الموصى به لترحيل المحتوى (Recommended Migration Order)

### المرحلة الأولى: ترحيل المجموعات المعرفية المستقلة (Self-Contained Datasets)
* **المستهدف:**
  1. `public/psychology_insights_dataset.json` ← جدول `psychology_insights`
  2. `src/data/emotions_details.json` ← جدول `emotions_encyclopedia`
  3. `src/pages/Refrance.jsx` ← جدول `references`
* **السبب:** بيانات نقية بصيغة structured data جاهزة ومفصولة تماماً عن أي واجهة تفاعلية، وترحيلها لن يمس أي منطق معقد.

### المرحلة الثانية: ترحيل المكتبة المعرفية والمسارات (Modules & Lessons)
* **المستهدف:**
  1. `src/data/modulesData.js` ← جداول `modules`, `module_sections`, `lessons`
* **السبب:** هذا هو قلب المحتوى التعليمي في التطبيق (أكثر من 5,000 سطر). نقله لقاعدة البيانات يقلل حجم الـ bundle الأولي للمشروع ويسرع التحميل بشكل ملحوظ.

### المرحلة الثالثة: ترحيل المقالات والمحتوى النصي من صفحات الـ JSX الثابتة
* **المستهدف:**
  1. `src/pages/ThinkingErrors.jsx`
  2. `src/pages/DefenseMechanisms.jsx`
  3. `src/pages/ToleranceWindow.jsx`
  4. `src/pages/About.jsx`
* **السبب:** تحويل الأخطاء المعرفية وآليات الدفاع إلى مقالات Markdown منظمة تفتح عبر قالب المقال الموحد `ArticleTemplate.jsx` أو `DynamicContent.jsx`، مع الاحتفاظ بالأكورديون والوسائط.

### المرحلة الرابعة: تفكيك وترحيل محتوى الصفحات الهجينة (Hybrid Separation)
* **المستهدف:**
  1. استخراج النصوص، الاستعارات، ونماذج الأسئلة من: `ACTSkills.jsx`, `DBTTipp.jsx`, `SFBTSkills.jsx`, `CognitiveReappraisal.jsx`, إلخ.
  2. حفظ المحتوى في جداول مخصصة للتمارين (`exercise_definitions`, `exercise_prompts`).
  3. ربط المكونات التفاعلية (المؤقتات، السلايدرز، محركات التسجيل) لتقرأ النصوص من قاعدة البيانات ديناميكياً مع الحفاظ على كامل منطق React التفاعلي.

---

## 3. المشاكل والتحديات المحتملة وطرق تفاديها (Potential Problems & Risks)

1. **حجم البيانات والـ Payload:**
   - ملف `emotions_details.json` يحتوي على 3,715 سطراً و `modulesData.js` يحتوي على أكثر من 5,300 سطر.
   - *الحل عند الترحيل:* استخدام pagination أو استدعاء جزئي حسب الوحدة/المشاعر بدلاً من جلب كامل الجدول في طلب واحد.

2. **التناقض بين الأخطاء المعرفية في مصدرين مختلفين:**
   - يوجد 16 خطأ معرفياً في `ThinkingErrors.jsx` بنمط مختصر ومراجع، بينما يوجد 19 خطأ معرفياً في `modulesData.js` بنمط تفصيلي إنساني وعميق جداً.
   - *الحل:* دمج المحتويين معاً في قاعدة البيانات بحيث يحتوي كل خطأ على النسخة المختصرة والنسخة المتعمقة والمراجع الموحدة.

3. **الاعتماد على المسارات الثابتة في الصور (Hardcoded Image Paths):**
   - العديد من الصفحات تعتمد على صور بمسارات محلية ثابتة في `/public`.
   - *الحل:* تخزين روابط الصور النسبية داخل حقول قاعدة البيانات (`image_url`) لتمكين تعديلها لاحقاً من لوحة الإدارة.

4. **تأثير الترحيل على البحث المحلي والـ AI Chat:**
   - محرك البحث السريع `searchIndex.js` و `pagesKnowledge.js` يعتمدان على بيانات ثابتة.
   - *الحل:* توفير Cache محلي أو طبقة خدمة موحدة (`contentService`) تزود البحث والشات بالبيانات تلقائياً بعد الترحيل.
