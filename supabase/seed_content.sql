-- ============================================================================
-- SEED DATA: Content Management System (CMS)
-- File: supabase/seed_content.sql
-- Description: Realistic seed data for articles, modules, blocks, references, and locations.
-- ============================================================================

-- 1. SEED SCIENTIFIC REFERENCES
INSERT INTO public.scientific_references (id, title, authors, year, publication, url, category)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cognitive Therapy of Depression', 'Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G.', 1979, 'Guilford Press', 'https://guilford.com/books/Cognitive-Therapy-of-Depression/Beck-Rush-Shaw-Emery/9780898629194', 'CBT'),
  ('22222222-2222-2222-2222-222222222222', 'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change', 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G.', 2011, 'Guilford Press', 'https://guilford.com', 'ACT'),
  ('33333333-3333-3333-3333-333333333333', 'DBT Skills Training Manual', 'Linehan, M. M.', 2014, 'Guilford Press', 'https://guilford.com', 'DBT')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED TAGS
INSERT INTO public.tags (id, name, slug, category)
VALUES
  ('44444444-4444-4444-4444-444444444441', 'العلاج المعرفي السلوكي', 'cbt', 'Therapy Framework'),
  ('44444444-4444-4444-4444-444444444442', 'تنظيم المشاعر', 'emotional-regulation', 'Core Skill'),
  ('44444444-4444-4444-4444-444444444443', 'اليقظة الذهنية', 'mindfulness', 'ACT/DBT')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED CORE CONTENT ITEM (Article / Scientific Page: Thinking Errors)
INSERT INTO public.content (
  id,
  translation_group_id,
  slug,
  language,
  title,
  description,
  content_type,
  status,
  markdown_content,
  plain_text,
  css,
  metadata,
  featured_image,
  seo_title,
  seo_description,
  published_at
) VALUES (
  '55555555-5555-5555-5555-555555555551',
  '66666666-6666-6666-6666-666666666661',
  'thinking-errors',
  'ar',
  'التشوهات المعرفية (Thinking Errors)',
  'دليل إكلينيكي مفصل للتعرف على أنماط التفكير التلقائية المشوهة وكيفية تفنيدها وتعديلها.',
  'scientific_page',
  'published',
  '# التشوهات المعرفية

التشوهات المعرفية هي أنماط تفكير معتادة وغير عقلانية تجعلنا نرى الواقع بصورة محرفة. هذه الأفكار تحدث تلقائياً دون وعي مسبق وتؤدي مباشرة إلى مشاعر سلبية حادة كالقلق والاكتئاب والذنب.

## 1. التفكير الكارثي (Catastrophizing)
توقع أسوأ السيناريوهات الممكنة وتضخيم احتمالية وقوعها، مع التقليل من قدرتك على التعامل معها.',
  'التشوهات المعرفية هي أنماط تفكير معتادة وغير عقلانية تجعلنا نرى الواقع بصورة محرفة. هذه الأفكار تحدث تلقائياً دون وعي مسبق وتؤدي مباشرة إلى مشاعر سلبية حادة كالقلق والاكتئاب والذنب. 1. التفكير الكارثي: توقع أسوأ السيناريوهات الممكنة وتضخيم احتمالية وقوعها.',
  '.content-box { border-radius: 12px; background: rgba(var(--primary-rgb), 0.05); }',
  '{"reading_time_minutes": 7, "difficulty": "intermediate", "framework": "CBT"}'::jsonb,
  '/article-by3DYy7JylaR.webp',
  'دليل التشوهات المعرفية | رحلة الوعي النفسي',
  'تعرف على الأخطاء المعرفية وكيفية تعديلها بالأساليب الإكلينيكية المعتمدة.',
  timezone('utc'::text, now())
) ON CONFLICT (slug, language) DO NOTHING;

-- 4. SEED CONTENT BLOCKS (Hybrid Component configuration)
INSERT INTO public.content_blocks (id, content_id, block_type, position, payload, metadata)
VALUES
  (
    '77777777-7777-7777-7777-777777777771',
    '55555555-5555-5555-5555-555555555551',
    'markdown',
    1,
    '{"content": "### تمرين عملي: تفنيد الفكرة التلقائية\nاستخدم الأداة التفاعلية التالية لتسجيل الفكرة واختبار مدى صحتها علمياً:"}'::jsonb,
    '{}'::jsonb
  ),
  (
    '77777777-7777-7777-7777-777777777772',
    '55555555-5555-5555-5555-555555555551',
    'interactive_component',
    2,
    '{"component": "thought-record-wizard", "props": {"initialDistortion": "catastrophizing", "mode": "compact"}}'::jsonb,
    '{"title": "مساعد تفكيك الفكرة التلقائية"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 5. LINK REFERENCE TO CONTENT
INSERT INTO public.content_references (content_id, reference_id, citation_note)
VALUES
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 'الفصل الثالث: التشوهات المعرفية ص 45-62')
ON CONFLICT (content_id, reference_id) DO NOTHING;

-- 6. LINK TAGS TO CONTENT
INSERT INTO public.content_tags (content_id, tag_id)
VALUES
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441'),
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444442')
ON CONFLICT (content_id, tag_id) DO NOTHING;

-- 7. SEED CONTENT LOCATIONS (Showcase slot placements)
INSERT INTO public.content_locations (id, content_id, page_route, slot, order_index, is_visible)
VALUES
  ('88888888-8888-8888-8888-888888888881', '55555555-5555-5555-5555-555555555551', '/home', 'featured', 1, true),
  ('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555551', '/ThinkingErrors', 'main_body', 1, true)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED MODULES & LEARNING PATHS
INSERT INTO public.modules (id, slug, title, description, order_index, background_image, status)
VALUES
  ('99999999-9999-9999-9999-999999999991', 'what-is-going', 'ما الذي يحدث معي؟', 'اكتشاف الأعراض الجسدية والمعرفية وفهم الإشارات التحذيرية المبكرة.', 1, '/ModulesBackgrounds/Gemini_Generated_Image_8pd1608pd1608pd1.jpg', 'published'),
  ('99999999-9999-9999-9999-999999999992', 'why-it-happens', 'لماذا يحدث هذا؟', 'فهم الجذور النمائية، آليات الدفاع اللاواعية، وصدمات الطفولة.', 2, '/ModulesBackgrounds/Gemini_Generated_Image_7i4q127i4q127i4q.jpg', 'published'),
  ('99999999-9999-9999-9999-999999999993', 'how-to-treat', 'كيف أتعامل معه؟', 'مهارات العلاج بالقبول والالتزام، تنظيم المشاعر، وتعديل السلوك.', 3, '/ModulesBackgrounds/Gemini_Generated_Image_68rj0q68rj0q68rj.jpg', 'published'),
  ('99999999-9999-9999-9999-999999999994', 'deep-dive', 'التعمق والوقاية', 'بناء الصلابة النفسية، أنماط التعلق الصحي، والوقاية من الانتكاسة.', 4, '/ModulesBackgrounds/Gemini_Generated_Image_kh50vwkh50vwkh50.jpg', 'published')
ON CONFLICT (id) DO NOTHING;

-- 9. LINK LESSON TO MODULE
INSERT INTO public.module_lessons (id, module_id, content_id, section_name, order_index)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999991', '55555555-5555-5555-5555-555555555551', 'أنماط التفكير المعيقة', 1)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED EMOTIONS ENCYCLOPEDIA SAMPLE
INSERT INTO public.emotions_encyclopedia (id, emotion_key, arabic_name, category, intensity_level, definition, body_sensations, triggers, healthy_expressions)
VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'grief',
    'الأسى والفقد (Grief)',
    'حزن',
    3,
    'استجابة عاطفية عميقة لفقدان شخص عزيز، علاقة، أو قيمة معنوية مهمة.',
    '["ثقل في الصدر", "تعب جسدي مستمر", "صعوبة في التركيز", "تغيرات في الشهية"]'::jsonb,
    '["وفاة شخص عزيز", "انتهاء علاقة عاطفية", "فقدان وظيفة أو مكانة", "تغير مرحلة عمرية"]'::jsonb,
    '["السماح للنفس بالبكاء والتعبير", "التحدث مع صديق داعم", "التدوين التعبيري", "طلب مساعدة مختص"]'::jsonb
  )
ON CONFLICT (emotion_key) DO NOTHING;

-- 11. SEED PSYCHOLOGY INSIGHTS SAMPLE
INSERT INTO public.psychology_insights (id, insight_text, author_or_source, topic, evidence_level, is_featured)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'المشاعر ليست حقائق مطلقة، بل هي إشارات بيولوجية تخبرنا بما نحتاجه في هذه اللحظة.',
    'Dr. Susan David - Emotional Agility',
    'المشاعر',
    'empirical',
    true
  )
ON CONFLICT (id) DO NOTHING;
