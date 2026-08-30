# CONTENT DATABASE SCHEMA DESIGN (PostgreSQL / Supabase)

> وثيقة التصميم الهيكلي الشامل لقاعدة البيانات لنظام إدارة المحتوى (CMS Database Architecture) الموجه لتطبيق Mental Journey Tracker.

---

## 1. نظرة عامة على المعمارية (Architecture Overview)

تم تصميم المعمارية لتكون:
1. **مرنة وغير مقيدة بصفحة واحدة (Decoupled & Flexible):** جدول محتوى موحد (`content`) يدعم كافة الأنواع السيكولوجية والعلمية (مقال، درس، صفحة علمية، تمرين، نبذة، مرجع) بدون تكرار الجداول.
2. **قابلة للتوسع عبر الكتل (Block-Based Content):** دعم دمج الـ Markdown، الصور، الاقتباسات، والمكونات التفاعلية (Interactive Components) عبر جدول `content_blocks`.
3. **متحكم بها بالكامل في التوزيع الموضعي (Slot-Based Placement):** التحكم من لوحة الإدارة في مكان ظهور كل محتوى داخل التطبيق عبر `content_locations`.
4. **تدعم تعدد اللغات والإصدارات (Multi-language & Versioning):** إمكانية استرجاع أي نسخة سابقة وإدارة اللغات بسهولة.
5. **أمان معزز (Row Level Security):** حماية صارمة تتيح للعامة قراءة المنشور فقط، وتمنح الإدارة الكاملة للمشرفين.

---

## 2. مخطط الجداول والعلاقات (Database Tables Specification)

### 1. جدول المحتوى الأساسي `content`
الجدول المحوري لجميع المواد المعرفية والمقالات والدروس والتمارين.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد للمحتوى |
| `slug` | `TEXT` | `NOT NULL` | الرابط اللطيف (فريد مع اللغة `UNIQUE(slug, language)`) |
| `title` | `TEXT` | `NOT NULL` | العنوان الرئيسي للمحتوى |
| `description` | `TEXT` | `NULL` | نبذة مختصرة أو مقتطف |
| `content_type` | `VARCHAR(50)` | `NOT NULL DEFAULT 'article'` | نوع المحتوى: `article`, `scientific_page`, `lesson`, `exercise`, `about`, `reference`, `dynamic_page` |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'draft'` | حالة النشر: `draft`, `published`, `archived` |
| `language` | `VARCHAR(10)` | `NOT NULL DEFAULT 'ar'` | كود اللغة: `ar`, `en`, إلخ |
| `markdown_content` | `TEXT` | `NULL` | النص الكامل بصيغة Markdown |
| `plain_text` | `TEXT` | `NULL` | نص مجرد للبحث الكامل والفهرسة السريعة |
| `css` | `TEXT` | `NULL` | تنسيقات CSS مخصصة ومحصورة بنطاق المحتوى (Scoped) |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | حقول مرنة (وقت القراءة، مستوى الصعوبة، إعدادات خاصة) |
| `featured_image` | `TEXT` | `NULL` | رابط الصورة الرئيسية |
| `seo_title` | `TEXT` | `NULL` | عنوان السيو ومحركات البحث |
| `seo_description` | `TEXT` | `NULL` | وصف السيو ومحركات البحث |
| `og_image` | `TEXT` | `NULL` | صورة المشاركة على شبكات التواصل |
| `canonical_url` | `TEXT` | `NULL` | الرابط الأصلي القياسي |
| `published_at` | `TIMESTAMPTZ` | `NULL` | تاريخ ووقت النشر الفعلي |
| `created_by` | `UUID` | `REFERENCES auth.users(id) ON DELETE SET NULL` | منشئ المحتوى |
| `updated_by` | `UUID` | `REFERENCES auth.users(id) ON DELETE SET NULL` | آخر من قام بالتعديل |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT timezone('utc'::text, now())` | تاريخ الإنشاء |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT timezone('utc'::text, now())` | تاريخ آخر تحديث |

---

### 2. جدول كتل المحتوى `content_blocks`
لتمثيل المحتويات المركبة التي تجمع بين نصوص Markdown ومكونات تفاعلية ووسائط.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد للكتلة |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | رابط المحتوى الأم |
| `block_type` | `VARCHAR(50)` | `NOT NULL` | نوع الكتلة: `markdown`, `image`, `quote`, `code`, `table`, `callout`, `exercise`, `interactive_component` |
| `position` | `INTEGER` | `NOT NULL DEFAULT 0` | ترتيب ظهور الكتلة داخل المحتوى |
| `payload` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | بيانات الكتلة (نص Markdown أو تعريف المكون التفاعلي `{"component": "breathing-478", "props": {}}`) |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | خصائص إضافية (ألوان مخصصة، أنماط عرض) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ الإنشاء |

---

### 3. جداول المسارات التعليمية `modules` و `module_lessons`
لدعم المسارات النفسية الأربعة وعشرات الدروس التابعة لها.

#### أ. جدول `modules`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد للمسار |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | الرابط اللطيف للمسار (مثال: `what-is-going`, `why-it-happens`) |
| `title` | `TEXT` | `NOT NULL` | اسم المسار |
| `description` | `TEXT` | `NULL` | الوصف الشامل للمسار وأهدافه |
| `order_index` | `INTEGER` | `NOT NULL DEFAULT 0` | ترتيب المسار في قائمة المسارات (1، 2، 3، 4) |
| `background_image` | `TEXT` | `NULL` | مسار صورة الغلاف أو الخلفية |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'published'` | حالة النشر: `draft`, `published` |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | إحصاءات، عدد الساعات المقدرة، أيقونة |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ الإنشاء |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ التحديث |

#### ب. جدول `module_lessons` (ربط الدروس بالمسارات)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد للدرس في المسار |
| `module_id` | `UUID` | `NOT NULL REFERENCES modules(id) ON DELETE CASCADE` | المسار التابع له |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | رابط المحتوى التفصيلي للدرس |
| `section_name` | `TEXT` | `NULL` | اسم القسم الفرعي (إن وجد) داخل المسار |
| `order_index` | `INTEGER` | `NOT NULL DEFAULT 0` | ترتيب الدرس داخل المسار |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ الإضافة |

---

### 4. جدول مواقع ظهور المحتوى `content_locations`
يسمح للمشرف باختيار أين يظهر أي محتوى ديناميكياً داخل واجهات التطبيق.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد للموضع |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المحتوى المعروض |
| `page_route` | `VARCHAR(100)` | `NOT NULL` | مسار الصفحة المستهدفة: `/home`, `/modules`, `/about`, `/ThinkingErrors`, `/c/:slug` |
| `slot` | `VARCHAR(50)` | `NOT NULL` | المكان المخصص داخل الصفحة: `hero`, `featured`, `insights_banner`, `main_body`, `sidebar`, `footer` |
| `order_index` | `INTEGER` | `NOT NULL DEFAULT 0` | ترتيب الظهور في حال وجود عناصر متعددة في نفس المكان |
| `is_visible` | `BOOLEAN` | `NOT NULL DEFAULT true` | تفعيل أو إخفاء الظهور |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ التعيين |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ التعديل |

---

### 5. جدول الوسائط الرقمية `content_media`
إدارة مكتبة الوسائط وربطها مع Supabase Storage.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | معرف الملف |
| `media_type` | `VARCHAR(20)` | `NOT NULL` | نوع الوسائط: `image`, `video`, `audio`, `file` |
| `url` | `TEXT` | `NOT NULL` | الرابط المباشر للوسيط (Public URL) |
| `storage_path` | `TEXT` | `NULL` | مسار التخزين الداخلي في Supabase Storage Bucket |
| `alt_text` | `TEXT` | `NULL` | النص البديل للوصولية (Accessibility) |
| `caption` | `TEXT` | `NULL` | تعليق توضيحي أسفل الصورة |
| `mime_type` | `VARCHAR(100)` | `NULL` | نوع الملف البرمجي (`image/webp`, `audio/mp3`) |
| `file_size` | `BIGINT` | `NULL` | حجم الملف بالبايت |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | الأبعاد (العرض والارتفاع)، المدة الصوتية |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ الرفع |

---

### 6. جداول المراجع العلمية `references` و `content_references`
دعم المراجع العلمية (80+ مرجع) وربطها بالمقالات بعلاقة متعدد إلى متعدد (Many-to-Many).

#### أ. جدول `references`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | معرف المرجع |
| `title` | `TEXT` | `NOT NULL` | عنوان الكتاب أو الورقة البحثية |
| `authors` | `TEXT` | `NULL` | أسماء الباحثين أو المؤلفين (مثل: Aaron T. Beck, Kristin Neff) |
| `year` | `INTEGER` | `NULL` | سنة النشر |
| `publication` | `TEXT` | `NULL` | الدورية العلمية أو دار النشر |
| `url` | `TEXT` | `NULL` | رابط المرجع على PubMed / ResearchGate / DOI |
| `doi` | `TEXT` | `NULL` | المعرف الرقمي DOI |
| `category` | `VARCHAR(50)` | `NULL` | تصنيف المرجع: `CBT`, `DBT`, `ACT`, `Neuroscience`, `Attachment` |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | حقول إضافية |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ الإضافة |

#### ب. جدول `content_references` (Junction Table)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المقال أو الدرس |
| `reference_id` | `UUID` | `NOT NULL REFERENCES references(id) ON DELETE CASCADE` | المرجع المقتبس |
| `citation_note` | `TEXT` | `NULL` | موضع الاقتباس أو رقم الصفحة |
| **PRIMARY KEY** | `(content_id, reference_id)` | — | قيد منع التكرار |

---

### 7. جدول إصدارات المحتوى `content_versions`
الاحتفاظ بسجل التعديلات الكامل وإمكانية استعادة النسخ السابقة.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | معرف الإصدار |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المحتوى الأصلي |
| `version_number` | `INTEGER` | `NOT NULL` | رقم الإصدار المتسلسل (1, 2, 3...) |
| `title` | `TEXT` | `NOT NULL` | عنوان المحتوى في هذه النسخة |
| `markdown_content` | `TEXT` | `NULL` | نص Markdown المحفوظ في هذا الإصدار |
| `blocks_snapshot` | `JSONB` | `DEFAULT '[]'::jsonb` | لقطة كاملة من كتل المحتوى في تلك اللحظة |
| `metadata_snapshot` | `JSONB` | `DEFAULT '{}'::jsonb` | لقطة من الميتا داتا |
| `change_summary` | `TEXT` | `NULL` | وصف سبب التعديل |
| `created_by` | `UUID` | `REFERENCES auth.users(id) ON DELETE SET NULL` | من قام بالتعديل |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT timezone('utc'::text, now())` | تاريخ إنشاء النسخة |

---

### 8. جداول التصنيفات والوسوم `tags` و `content_tags`

#### أ. جدول `tags`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | معرف الوسم |
| `name` | `VARCHAR(50)` | `NOT NULL` | اسم الوسم (مثال: "العلاج السلوكي المعرفي", "تنظيم الانفعال") |
| `slug` | `VARCHAR(50)` | `UNIQUE NOT NULL` | الرابط اللطيف للوسم |
| `category` | `VARCHAR(50)` | `NULL` | تصنيف الوسم |

#### ب. جدول `content_tags`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المحتوى |
| `tag_id` | `UUID` | `NOT NULL REFERENCES tags(id) ON DELETE CASCADE` | الوسم |
| **PRIMARY KEY** | `(content_id, tag_id)` | — | قيد منع التكرار |

---

### 9. جدول العلاقات بين المحتويات `content_relationships`
لربط المواد المعرفية ذات الصلة (مثال: ربط "الأخطاء المعرفية" بـ "إعادة التقييم المعرفي").

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `parent_content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المحتوى الحالي |
| `related_content_id` | `UUID` | `NOT NULL REFERENCES content(id) ON DELETE CASCADE` | المحتوى ذو الصلة |
| `relationship_type` | `VARCHAR(30)` | `NOT NULL DEFAULT 'related'` | نوع العلاقة: `related`, `prerequisite`, `next_step` |
| `order_index` | `INTEGER` | `NOT NULL DEFAULT 0` | ترتيب العرض |
| **PRIMARY KEY** | `(parent_content_id, related_content_id)` | — | قيد منع التكرار |

---

### 10. الجداول المعرفية التخصصية (Specialized Scientific Datasets)

#### أ. موسوعة المشاعر `emotions_encyclopedia` (تستوعب `emotions_details.json`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | معرف الشعور |
| `emotion_key` | `VARCHAR(50)` | `UNIQUE NOT NULL` | المفتاح الإنجليزي (مثل: `joy`, `anxiety`, `grief`) |
| `arabic_name` | `VARCHAR(100)` | `NOT NULL` | الاسم بالعربية |
| `category` | `VARCHAR(50)` | `NOT NULL` | الفئة الأساسية (سعادة، خوف، حزن، غضب، إلخ) |
| `intensity_level` | `INTEGER` | `DEFAULT 1` | مستوى العمق في عجلة المشاعر (1 = أساسي، 2 = ثانوي، 3 = دقيق) |
| `definition` | `TEXT` | `NULL` | التعريف العلمي والنفسي للشعور |
| `body_sensations` | `JSONB` | `DEFAULT '[]'::jsonb` | الاستجابات الجسدية المرافقة (نبضات القلب، الشد العضلي) |
| `triggers` | `JSONB` | `DEFAULT '[]'::jsonb` | المحفزات المسببة للشعور |
| `healthy_expressions` | `JSONB` | `DEFAULT '[]'::jsonb` | الطرق الصحية والواعية للتعامل مع الشعور |
| `metadata` | `JSONB` | `DEFAULT '{}'::jsonb` | اللون التعبيري، الأيقونة، التردد |

#### ب. ومضات علم النفس السريري `psychology_insights` (تستوعب `psychology_insights_dataset.json`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | المعرف الفريد |
| `insight_text` | `TEXT` | `NOT NULL` | نص الملاحظة أو الاقتباس العلمي |
| `author_or_source` | `TEXT` | `NULL` | المصدر أو الباحث |
| `topic` | `VARCHAR(50)` | `NULL` | الموضوع (المشاعر، التفكير، التعلق، اليقظة) |
| `evidence_level` | `VARCHAR(30)` | `DEFAULT 'clinical'` | مستوى الدليل: `empirical`, `clinical_observation`, `neurobiological` |
| `is_featured` | `BOOLEAN` | `DEFAULT false` | للعرض في الصفحة الرئيسية |

---

## 3. الفهارس وتحسين الأداء (Indexes & Constraints)

```sql
-- فهارس البحث والتنقل السريع
CREATE INDEX idx_content_slug_lang ON public.content(slug, language);
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_content_type ON public.content(content_type);
CREATE INDEX idx_content_created_at ON public.content(created_at DESC);

-- فهرس البحث النصي الكامل باللغة العربية والإنجليزية
CREATE INDEX idx_content_search ON public.content USING gin(to_tsvector('arabic', COALESCE(title, '') || ' ' || COALESCE(plain_text, '')));

-- فهارس الكتل والمواقع والدروس
CREATE INDEX idx_content_blocks_content_pos ON public.content_blocks(content_id, position ASC);
CREATE INDEX idx_content_locations_route_slot ON public.content_locations(page_route, slot, order_index ASC);
CREATE INDEX idx_module_lessons_module_order ON public.module_lessons(module_id, order_index ASC);
```

---

## 4. استراتيجية أمان البيانات (Row Level Security Strategy)

### القواعد العامة:
1. **الجمهور والزوار (Public Users):**
   - استعلام وقراءة (`SELECT`) فقط للمحتوى الذي يحمل `status = 'published'`.
   - قراءة المراجع، الوسائط، ومواقع المحتوى المفعلة `is_visible = true`.
2. **المشرفون (Admins):**
   - صلاحية كاملة (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) لجميع الجداول والحالات (بما فيها المسودات `draft` والمحذوفات `archived`).
   - التحقق من صفة المشرف عبر `profiles.role = 'admin'` المرتبط بـ `auth.uid()`.

```sql
-- تفعيل RLS على جميع جداول الـ CMS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotions_encyclopedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_insights ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة للمحتوى المنشور
CREATE POLICY "Public read published content" ON public.content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published blocks" ON public.content_blocks
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.content WHERE content.id = content_blocks.content_id AND content.status = 'published'));

CREATE POLICY "Public read locations" ON public.content_locations
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read modules" ON public.modules
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read references" ON public.references
  FOR SELECT USING (true);

CREATE POLICY "Public read emotions" ON public.emotions_encyclopedia
  FOR SELECT USING (true);

CREATE POLICY "Public read insights" ON public.psychology_insights
  FOR SELECT USING (true);

-- سياسات إدارة المشرفين الكاملة
CREATE POLICY "Admin full access content" ON public.content
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin full access blocks" ON public.content_blocks
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin full access locations" ON public.content_locations
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin full access modules" ON public.modules
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
```

---

## 5. أمثلة على السجلات في قاعدة البيانات (Example Records)

### أ. سجل مقال معرفي في جدول `content`
```json
{
  "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "slug": "thinking-errors",
  "title": "التشوهات المعرفية (Thinking Errors)",
  "description": "دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها.",
  "content_type": "scientific_page",
  "status": "published",
  "language": "ar",
  "markdown_content": "# التشوهات المعرفية\n\nالتشوهات المعرفية هي أنماط تفكير غير عقلانية تجعلنا نرى الواقع بصورة مشوهة...",
  "plain_text": "التشوهات المعرفية هي أنماط تفكير غير عقلانية تجعلنا نرى الواقع بصورة مشوهة وتؤدي إلى مشاعر سلبية حادة مثل القلق والاكتئاب...",
  "css": ".content-box { border-radius: 12px; background: rgba(var(--primary-rgb), 0.05); }",
  "metadata": {
    "reading_time_minutes": 8,
    "difficulty": "beginner",
    "framework": "CBT"
  },
  "featured_image": "/article-by3DYy7JylaR.webp",
  "seo_title": "دليل التشوهات المعرفية الشامل | رحلة الوعي النفسي",
  "seo_description": "تعرف على 16 خطأ معرفياً شائعاً وكيفية التعامل معها بأساليب العلاج المعرفي السلوكي المعتمدة.",
  "published_at": "2026-08-30T09:00:00Z"
}
```

### ب. سجل كتلة تفاعلية في جدول `content_blocks`
```json
{
  "id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "content_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "block_type": "interactive_component",
  "position": 2,
  "payload": {
    "component": "thought-record-wizard",
    "props": {
      "initialDistortion": "catastrophizing",
      "mode": "guided"
    }
  },
  "metadata": {
    "title": "تطبيق تفنيد الفكرة عملياً"
  }
}
```

### ج. سجل موقع ظهور في جدول `content_locations`
```json
{
  "id": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
  "content_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "page_route": "/home",
  "slot": "featured",
  "order_index": 1,
  "is_visible": true
}
```
