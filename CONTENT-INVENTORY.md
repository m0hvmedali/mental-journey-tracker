# CONTENT INVENTORY — فهرس وحصر المحتوى الشامل

> هذا الملف يحتوي على حصر وتحليل دقيق لجميع عناصر المحتوى داخل المشروع، تصنيفها، تحديد المنطق التفاعلي (Interactive Logic) الذي يجب أن يبقى في React، مصادر المحتوى الحالية، والمسارات المرتبطة والصور المستخدمة.

---

## 1. جدول الحصر العام لصفحات ومكونات المشروع

| File / Component | Route | Type | Content | Interactive Logic | Images | Migration Format |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `src/pages/ThinkingErrors.jsx` | `/ThinkingErrors` | **CONTENT** | Yes (16 خطأ معرفي مع شرح وعلاج ومراجع) | Minimal (Accordion/Filter) | Yes (`/article-by3DYy7JylaR.webp`, `/unnamed.png`, إلخ) | Markdown / Structured JSON in DB |
| `src/pages/DefenseMechanisms.jsx` | `/DefenseMechanisms` | **CONTENT** | Yes (آليات الدفاع النفسي، أمثلة، مراجع) | Minimal (Accordion/Scroll) | Yes (`/DfenssImg/...`) | Markdown / Structured Articles in DB |
| `src/pages/ToleranceWindow.jsx` | `/ToleranceWindow` | **CONTENT** | Yes (الامتنان والتسامح، أبحاث، تمارين) | Minimal (Accordion) | No | Markdown / Article in DB |
| `src/pages/About.jsx` | `/about` | **CONTENT** | Yes (رؤية التطبيق، المميزات، الفريق) | No | No | DB / Static Page |
| `src/pages/Refrance.jsx` | `/refrance` | **CONTENT** | Yes (أكثر من 80 مرجعاً علمياً وبحثاً مصنفاً) | Minimal (Category filtering) | No | DB Table (`references`) |
| `src/data/modulesData.js` | `/modules/:slug`, `/modules/:moduleSlug/:pageSlug` | **CONTENT** | Yes (أكثر من 5,000 سطر من المحتوى السيكولوجي الضخم: 4 وحدات رئيسية + عشرات الدروس) | No | Yes (`/ModulesBackgrounds/...`) | DB Tables (`modules`, `lessons`, `sections`) |
| `src/data/emotions_details.json` | Used across app (`/wheel`, AI Chat) | **CONTENT** | Yes (قاموس المشاعر: أكثر من 3,700 سطر يضم تعريفات المشاعر، الجسد، المحفزات، التعبيرات) | No | No | DB Table (`emotions_encyclopedia`) |
| `public/psychology_insights_dataset.json` | Used in Home/Banners | **CONTENT** | Yes (1,500 سطر من الاقتباسات العلمية والملاحظات السريرية الموثقة) | No | No | DB Table (`psychological_insights`) |
| `src/pages/ACTSkills.jsx` | `/act-skills` | **HYBRID** | Yes (مفاهيم العلاج بالقبول والالتزام، نصوص الاستعارات، الأسئلة) | Yes (تطبيق الفصل المعرفي، مؤقت 5-4-3-2-1، إدارة البطاقات المحفوظة) | No | Content to DB, Form & Timer to React |
| `src/pages/DBTTipp.jsx` | `/dbt-tipp` | **HYBRID** | Yes (شرح مهارات TIPP لتنظيم الانفعال الحاد، الإرشادات العلمية) | Yes (مؤقت الغمر بالماء البارد، تمرين التنفس التفاعلي، مقاييس الشدة) | No | Content to DB, Interactive Exercises to React |
| `src/pages/CognitiveReappraisal.jsx` | `/cognitive-reappraisal` | **HYBRID** | Yes (خطوات إعادة التقييم المعرفي، أمثلة واقعية، إرشادات التفكير) | Yes (معالج الخطوات متعدد المراحل، حفظ التحليل، حقول الإدخال) | No | Guidance to DB, Interactive Wizard to React |
| `src/pages/EmotionalRegulation.jsx` | `/emotional-regulation` | **HYBRID** | Yes (دليل مهارات تنظيم المشاعر DBT/CBT، بنك المهارات) | Yes (محدد المهارة حسب الحالة، فلترة التمارين، حفظ المفضلة) | No | Content & Skill library to DB, Selector to React |
| `src/pages/SuppressionVsRegulation.jsx` | `/suppression-vs-regulation` | **HYBRID** | Yes (المقارنة العلمية بين الكبت والتنظيم، دراسات الدماغ) | Yes (اختبار المقارنة الذاتي، تتبع الاستجابة التفاعلية) | No | Study content to DB, Self-test to React |
| `src/pages/PsychodynamicSkills.jsx` | `/psychodynamic-skills` | **HYBRID** | Yes (المفاهيم التحليلية، اكتشاف الأنماط المتكررة اللاواعية) | Yes (أداة تفكيك السيناريوهات، تدوين التداعيات الحرة) | No | Theory to DB, Journaling tool to React |
| `src/pages/SFBTSkills.jsx` | `/sfbt-skills` | **HYBRID** | Yes (أسئلة المعجزة، استثناءات المشكلة، مقاييس التقدم 1-10) | Yes (أداة قياس الميزان التفاعلي، مولد أسئلة الاستثناء) | No | Question frameworks to DB, Slider/Builder to React |
| `src/pages/SelfCompassion.jsx` | `/self-compassion` | **HYBRID** | Yes (عناصر الشفقة بالذات لكريستين نيف، رسائل التعاطف) | Yes (تمرين كتابة رسالة التعاطف، مؤقت استراحة الشفقة) | No | Texts & prompts to DB, Exercise canvas to React |
| `src/pages/RelationshipDynamics.jsx` | `/relationship-dynamics` | **HYBRID** | Yes (أنماط التعلق العاطفي، دورات التواصل السامة، حدود العلاقات) | Yes (حاسبة استكشاف نمط التعلق، محلل المواقف التفاعلي) | No | Attachment guide to DB, Assessment to React |
| `src/pages/Breathing478.jsx` | `/Breathing478` | **INTERACTIVE** | Partial (تعليمات دورة التنفس) | Yes (محرك الرسوم المتحركة لدائرة التنفس، الصوت، عداد الثواني 4-7-8) | No | Static text to DB, Core Engine in React |
| `src/pages/Wheel.jsx` / `EmotionWheel.jsx` | `/wheel` | **INTERACTIVE** | Partial (تسميات طبقات المشاعر 3 مستويات) | Yes (SVG Wheel Math، حساب زوايا الدوران، النقر التفاعلي، التكبير/التصغير) | No | Emotion names in DB, SVG Visualizer in React |
| `src/pages/EmotionSelect.jsx` | `/emotion-select` | **INTERACTIVE** | Partial (قوائم المشاعر) | Yes (نظام اختيار المشاعر متعدد الطبقات وتمرير الحالة لليوميات) | No | Emotion list in DB, Flow in React |
| `src/pages/Diary.jsx` | `/diary` | **INTERACTIVE** | Minimal (واجهة التدوين) | Yes (محرر النصوص، تسجيل الصوت، إرفاق الصور، البحث والفلترة، التخزين) | No | User data to DB/Local, Editor in React |
| `src/pages/Progress.jsx` | `/progress` | **INTERACTIVE** | Minimal (عناوين المقاييس) | Yes (حساب الإحصاءات، رسم الخط الزمني للتعافي، حساب السلاسل والتكرار) | No | Logs in DB, Recharts/Calculators in React |
| `src/pages/Home.jsx` | `/home` | **HYBRID** | Yes (نصوص الترحيب، بطاقات الاستكشاف السريع) | Yes (التحقق من المستخدم، إدارة لوحة المهام، استدعاء التنبيهات) | Yes (`/ChatGPT_Image_...svg`, `/image (4).png`) | Content to DB, Dashboard to React |
| `src/pages/Modules.jsx` | `/modules` | **HYBRID** | Yes (فهرس المسارات الأربعة ووصفها) | Yes (الربط الديناميكي والتنقل وحفظ حالة التقدم) | Yes (`/ModulesBackgrounds/...`) | Module metadata in DB, Grid in React |
| `src/pages/ModuleDetail.jsx` | `/modules/:slug` | **HYBRID** | Yes (ملخص الوحدة وأهداف التعلم وقائمة الدروس) | Yes (التنقل التفاعلي ومسار التقدم) | Yes (Hero backgrounds) | DB Driven Module View |
| `src/pages/ModuleInternalPage.jsx` | `/modules/:moduleSlug/:pageSlug` | **CONTENT** | Yes (محتوى الدرس المفصل) | Minimal (تبديل التبويبات والملاحظات) | Yes | Full DB Content via Article Template |
| `src/pages/DynamicContent.jsx` | `/c/:slug` | **CONTENT** | Yes (مقالات معرفية مبنية على markdown) | Minimal (Markdown view) | Yes | Database Markdown Renderer |
| `src/pages/Community.jsx` | `/community` | **INTERACTIVE** | Minimal | Yes (مشاركة المنشورات، التفاعل، التعليقات المجهولة) | No | Posts in DB, Social Feed in React |
| `src/pages/Settings.jsx` | `/setting` | **INTERACTIVE** | Minimal | Yes (إدارة الثيم، اللغة، التنبيهات، مسح البيانات، إدارة الحساب) | No | State in React/Local/DB |
| `src/pages/Login.jsx` | `/` | **INTERACTIVE** | Minimal | Yes (تسجيل الدخول، التحقق، تعيين الاسم) | Yes (`/ChatGPT_Image_...svg`) | Auth Flow in React |
| `src/pages/Test.jsx` | `/test` | **INTERACTIVE** | Test/Debug | Yes (أزرار اختبار النظام) | No | Developer Utility |
| `src/pages/LLMDebug.jsx` | `/debug-llm` | **INTERACTIVE** | Test/Debug | Yes (أداة اختبار نماذج الذكاء الاصطناعي والتوليد) | No | Developer Utility |
| `src/pages/admin/ContentManager.jsx` | `/admin/content` | **INTERACTIVE** | Admin | Yes (لوحة إدارة المحتوى والمسارات والمقالات) | No | Admin UI in React |
| `src/pages/admin/ContentEditor.jsx` | `/admin/content/new`, `/admin/content/edit/:id` | **INTERACTIVE** | Admin | Yes (محرر Markdown مع المعاينة الفورية وإعدادات الميتا) | No | Admin UI in React |

---

## 2. تفصيل الصفحات الهجينة (Hybrid) — فصل المنطق عن المحتوى

### 1. `ACTSkills.jsx` (`/act-skills`)
- **المحتوى القابل للنقل لقاعدة البيانات (Content to DB):**
  - عناوين وأوصاف أقسام ACT الستة (الفصل المعرفي، القبول، اللحظة الحالية، القيم، الاستعارات، العمل الملتزم).
  - نصوص التمارين الإرشادية (مثال: نصوص بطاقات الأفكار اللاصقة، استعارة الحافلة والركاب، استعارة الرمال المتحركة).
  - قائمة استراتيجيات التجنب الافتراضية وآثارها قصيرة وطويلة المدى.
  - قائمة القيم الحياتية الأساسية (الأسرة، النمو الشخصي، الصحة، العطاء).
- **المنطق التفاعلي المستمر في React (Interactive Logic):**
  - تطبيق تفكيك الأفكار (Defusion Card Creator) وحفظها في `localStorage` أو قاعدة البيانات.
  - مؤقت تمرين الحواس 5-4-3-2-1 مع التحكم بالبدء/الإيقاف والعد التنازلي.
  - محدد ومقياس أهمية القيم وترتيب أولوياتها.

### 2. `DBTTipp.jsx` (`/dbt-tipp`)
- **المحتوى القابل للنقل لقاعدة البيانات (Content to DB):**
  - شرح مهارات TIPP (درجة الحرارة، التمرين المكثف، التنفس المنظم، استرخاء العضلات المتدرج).
  - الأساس البيولوجي والعصبي لتأثير العصب الحائر (Vagus Nerve) واستجابة الغوص (Mammalian Dive Reflex).
  - المحاذير الطبية (Contraindications) وإرشادات السلامة.
- **المنطق التفاعلي المستمر في React (Interactive Logic):**
  - عداد ومؤقت كمادات الثلج / حبس الأنفاس التفاعلي.
  - دليل الرسوم المتحركة لمزامنة الشهيق والزفير بتوقيتات قابلة للتخصيص.
  - مقياس تسجيل شدة الضيق (Distress Scale 0-100) قبل وبعد التمرين.

### 3. `CognitiveReappraisal.jsx` (`/cognitive-reappraisal`)
- **المحتوى القابل للنقل لقاعدة البيانات (Content to DB):**
  - شرح النموذج المعرفي ثلاثي الأركان (الحدث ← الفكرة التلقائية ← الشعور والسلوك).
  - بنك الأسئلة السقراطية لتفنيد الأفكار (فحص الأدلة، التفسيرات البديلة، أسوأ وأفضل سيناريو).
  - أمثلة سريرية توضيحية لسيناريوهات إعادة الصياغة.
- **المنطق التفاعلي المستمر في React (Interactive Logic):**
  - معالج الخطوات الإرشادي (Step-by-Step Thought Record Wizard).
  - حقول إدخال الفكرة، تقييم نسبة التصديق (0-100%)، وتوليد الفكرة المتوازنة البديلة وحفظ السجل.

### 4. `SFBTSkills.jsx` (`/sfbt-skills`)
- **المحتوى القابل للنقل لقاعدة البيانات (Content to DB):**
  - صياغات الأسئلة السحرية (Miracle Question)، أسئلة البحث عن الاستثناءات (Exception Finding)، وأسئلة التكيف والصلابة (Coping Questions).
  - الاقتباسات والمراجع الخاصة بمؤسسي المدرسة (ستيف دي شازر وإنسو كيم بيرج).
- **المنطق التفاعلي المستمر في React (Interactive Logic):**
  - أداة ميزان التقييم التدريجي (Scaling Slider 1-10) ومقارنة اليوم بالأمس.
  - محرر صياغة أهداف المستقبل المفضل وتسجيل الخطوات الصغيرة الفورية.

---

## 3. مصادر المحتوى الحالية في المشروع (Content Sources)

1. **JavaScript Data Objects (`src/data/modulesData.js`):** المصدر الأضخم في المشروع (أكثر من 5,300 سطر)، يحتوي على 4 وحدات دراسية مفصلة، تشمل التشوهات المعرفية، آليات الدفاع، المعايير التشخيصية DSM-5/ICD-11، ونماذج علم النفس الإكلينيكي.
2. **JSON Datasets (`src/data/emotions_details.json` & `public/psychology_insights_dataset.json`):**
   - قاموس المشاعر النفسي الشامل (3,715 سطر) يغذي عجلة المشاعر والشات الذكي.
   - مجموعة البيانات المعرفية للاقتباسات والأبحاث النفسية الموثقة (1,502 سطر).
3. **Hardcoded JSX (`src/pages/*.jsx`):**
   - نصوص ثابتة ومصفوفات داخل مكونات الصفحات: `ThinkingErrors.jsx`, `DefenseMechanisms.jsx`, `ToleranceWindow.jsx`, `ACTSkills.jsx`, `DBTTipp.jsx`, `Refrance.jsx`, `About.jsx`.
4. **Localization Files (`src/locales/ar.json`, `src/locales/en.json`):**
   - نصوص واجهة المستخدم، التسميات، القوائم، وأزرار التنقل.
5. **Knowledge Base Corpus (`src/data/pagesKnowledge.js` & `src/data/searchIndex.js`):**
   - ملخصات وتعريفات الصفحات والكلمات المفتاحية المستخدمة في البحث والمساعد الذكي.

---

## 4. حصر الصور المستخدمة مع المحتوى (Images Inventory)

- **خلفيات الوحدات والمسارات (`public/ModulesBackgrounds/`):**
  - `Gemini_Generated_Image_8pd1608pd1608pd1.jpg` (Module 1 - What is going?)
  - `Gemini_Generated_Image_7i4q127i4q127i4q.jpg` (Module 2 - Why is it happening?)
  - `Gemini_Generated_Image_68rj0q68rj0q68rj.jpg` (Module 3 - How to treat?)
  - `Gemini_Generated_Image_kh50vwkh50vwkh50.jpg` (Module 4 - Deep dive)
- **صور الأخطاء المعرفية (`public/`):**
  - `/article-by3DYy7JylaR.webp`
  - `/cognitive-bias-judgement-error-systematic-600nw-2236319449.webp`
  - `/97ba60a5ff238613c5d0b849940f54ac.jpg`
  - `/68c5165ddf8ecec3dc33fc50e74ab197.jpg`
  - `/thinking-errors-2-rs.webp`
  - `/03e37ed243361d08d8a028d0e233f800.jpg`
  - `/97fb1a103b72240222f1302188e6b999.jpg`
  - `/f6761102f1804ca5059d71b5c8a8d3b8.jpg`
  - `/b9838022495db0b3d51e37fe7bf50c62.jpg`
  - `/Food-Labeling-Services-by-K-International.jpg`
  - `/unnamed.png`
  - `/Jul22_20_86435164-1200x675.jpg`
  - `/1-1591504.webp`
  - `/42022300218201.jpg`
  - `/images.jpeg`
  - `/Common-Thinking-Errors.jpeg`
- **صور آليات الدفاع النفسي (`public/DfenssImg/`):**
  - `Digital Illustration of Fishbowl with Broken Padlock and Text (1).png`
  - `Digital Illustration of Fishbowl with Broken Padlock and Text (3).png`
  - `Figure In Dark Clothing Surrounded By Lush Forest Background (1).png` إلى `(5).png`
  - `330px-UWASocrates_gobeirne_cropped.jpg`
  - `1700840661142.jfif`
  - `9b6ae604eb373de771a17d0bda675526.jpg`
- **شعار وواجهة التطبيق:**
  - `/ChatGPT_Image_Jul_19_2025_06_34_59_PM.svg`
  - `/image (4).png`
