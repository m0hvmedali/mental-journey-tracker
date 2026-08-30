-- ============================================================================
-- MIGRATION: Content Management System (CMS) Full Schema
-- File: supabase/migrations/20260830_content_management_system.sql
-- Description: Comprehensive database architecture for mental wellness platform content.
-- ============================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Universal trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure profiles table exists for RLS verification
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'user',
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. CORE CONTENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_group_id UUID DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'ar',
  title TEXT NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL DEFAULT 'article',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  markdown_content TEXT,
  plain_text TEXT,
  css TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(plain_text, ''))
  ) STORED,

  CONSTRAINT chk_content_status CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT chk_content_type CHECK (content_type IN ('article', 'scientific_page', 'lesson', 'exercise', 'about', 'reference', 'dynamic_page', 'insight')),
  CONSTRAINT chk_content_lang CHECK (language IN ('ar', 'en')),
  CONSTRAINT uq_content_slug_lang UNIQUE (slug, language)
);

DROP TRIGGER IF EXISTS trigger_update_content_updated_at ON public.content;
CREATE TRIGGER trigger_update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. CONTENT BLOCKS (Flexible Markdown, Interactive Components, Media)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT chk_block_type CHECK (block_type IN ('markdown', 'image', 'quote', 'code', 'table', 'callout', 'exercise', 'interactive_component', 'audio', 'video')),
  CONSTRAINT uq_content_block_position UNIQUE (content_id, position)
);

-- ============================================================================
-- 4. MODULES & LESSONS (Structured Psychological Learning Paths)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  background_image TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT chk_module_status CHECK (status IN ('draft', 'published', 'archived'))
);

DROP TRIGGER IF EXISTS trigger_update_modules_updated_at ON public.modules;
CREATE TRIGGER trigger_update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.module_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  section_name TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT uq_module_content UNIQUE (module_id, content_id)
);

-- ============================================================================
-- 5. CONTENT LOCATIONS (Slot-Based UI Placement)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  page_route VARCHAR(100) NOT NULL,
  slot VARCHAR(50) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT uq_route_slot_content UNIQUE (page_route, slot, content_id)
);

DROP TRIGGER IF EXISTS trigger_update_locations_updated_at ON public.content_locations;
CREATE TRIGGER trigger_update_locations_updated_at
  BEFORE UPDATE ON public.content_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 6. MEDIA ASSETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  caption TEXT,
  mime_type VARCHAR(100),
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT chk_media_type CHECK (media_type IN ('image', 'video', 'audio', 'file'))
);

DROP TRIGGER IF EXISTS trigger_update_media_updated_at ON public.content_media;
CREATE TRIGGER trigger_update_media_updated_at
  BEFORE UPDATE ON public.content_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. SCIENTIFIC REFERENCES & CITATIONS (Avoid reserved 'references' keyword)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.scientific_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT,
  year INTEGER,
  publication TEXT,
  url TEXT,
  doi TEXT,
  category VARCHAR(50),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_update_references_updated_at ON public.scientific_references;
CREATE TRIGGER trigger_update_references_updated_at
  BEFORE UPDATE ON public.scientific_references
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.content_references (
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES public.scientific_references(id) ON DELETE CASCADE,
  citation_note TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (content_id, reference_id)
);

-- ============================================================================
-- 8. CONTENT VERSIONS & AUDIT LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  markdown_content TEXT,
  blocks_snapshot JSONB DEFAULT '[]'::jsonb,
  metadata_snapshot JSONB DEFAULT '{}'::jsonb,
  change_summary TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),

  CONSTRAINT uq_content_version UNIQUE (content_id, version_number)
);

-- ============================================================================
-- 9. TAGS & CONTENT CATEGORIZATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.content_tags (
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- ============================================================================
-- 10. CONTENT RELATIONSHIPS (Related Topics, Prerequisites)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_relationships (
  parent_content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  related_content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  relationship_type VARCHAR(30) NOT NULL DEFAULT 'related',
  order_index INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (parent_content_id, related_content_id),

  CONSTRAINT chk_not_self_related CHECK (parent_content_id <> related_content_id),
  CONSTRAINT chk_relationship_type CHECK (relationship_type IN ('related', 'prerequisite', 'next_step', 'contrast'))
);

-- ============================================================================
-- 11. SPECIALIZED SCIENTIFIC DATASETS
-- ============================================================================

-- Emotions Encyclopedia (Ported from emotions_details.json)
CREATE TABLE IF NOT EXISTS public.emotions_encyclopedia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_key VARCHAR(50) UNIQUE NOT NULL,
  arabic_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  intensity_level INTEGER DEFAULT 1,
  definition TEXT,
  body_sensations JSONB DEFAULT '[]'::jsonb,
  triggers JSONB DEFAULT '[]'::jsonb,
  healthy_expressions JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_update_emotions_updated_at ON public.emotions_encyclopedia;
CREATE TRIGGER trigger_update_emotions_updated_at
  BEFORE UPDATE ON public.emotions_encyclopedia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Psychology Insights (Ported from psychology_insights_dataset.json)
CREATE TABLE IF NOT EXISTS public.psychology_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_text TEXT NOT NULL,
  author_or_source TEXT,
  topic VARCHAR(50),
  evidence_level VARCHAR(30) DEFAULT 'clinical',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_update_insights_updated_at ON public.psychology_insights;
CREATE TRIGGER trigger_update_insights_updated_at
  BEFORE UPDATE ON public.psychology_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 12. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_content_slug_lang ON public.content(slug, language);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON public.content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON public.content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_search_vector ON public.content USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_content_blocks_content_pos ON public.content_blocks(content_id, position ASC);
CREATE INDEX IF NOT EXISTS idx_module_lessons_module_order ON public.module_lessons(module_id, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_content_locations_route_slot ON public.content_locations(page_route, slot, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_scientific_ref_category ON public.scientific_references(category);
CREATE INDEX IF NOT EXISTS idx_emotions_category ON public.emotions_encyclopedia(category);
CREATE INDEX IF NOT EXISTS idx_insights_topic ON public.psychology_insights(topic);

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all CMS tables
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scientific_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotions_encyclopedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_insights ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public can view published content" ON public.content;
CREATE POLICY "Public can view published content" ON public.content
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view blocks of published content" ON public.content_blocks;
CREATE POLICY "Public can view blocks of published content" ON public.content_blocks
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.content WHERE content.id = content_blocks.content_id AND content.status = 'published'));

DROP POLICY IF EXISTS "Public can view published modules" ON public.modules;
CREATE POLICY "Public can view published modules" ON public.modules
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view module lessons" ON public.module_lessons;
CREATE POLICY "Public can view module lessons" ON public.module_lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.modules WHERE modules.id = module_lessons.module_id AND modules.status = 'published')
    AND EXISTS (SELECT 1 FROM public.content WHERE content.id = module_lessons.content_id AND content.status = 'published')
  );

DROP POLICY IF EXISTS "Public can view active locations" ON public.content_locations;
CREATE POLICY "Public can view active locations" ON public.content_locations
  FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Public can view media" ON public.content_media;
CREATE POLICY "Public can view media" ON public.content_media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view scientific references" ON public.scientific_references;
CREATE POLICY "Public can view scientific references" ON public.scientific_references
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view content references" ON public.content_references;
CREATE POLICY "Public can view content references" ON public.content_references
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view tags" ON public.tags;
CREATE POLICY "Public can view tags" ON public.tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view content tags" ON public.content_tags;
CREATE POLICY "Public can view content tags" ON public.content_tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view content relationships" ON public.content_relationships;
CREATE POLICY "Public can view content relationships" ON public.content_relationships
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view emotions encyclopedia" ON public.emotions_encyclopedia;
CREATE POLICY "Public can view emotions encyclopedia" ON public.emotions_encyclopedia
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view psychology insights" ON public.psychology_insights;
CREATE POLICY "Public can view psychology insights" ON public.psychology_insights
  FOR SELECT USING (true);

-- ADMIN FULL ACCESS POLICIES (ALL OPERATIONS: SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admin full access content" ON public.content;
CREATE POLICY "Admin full access content" ON public.content
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_blocks" ON public.content_blocks;
CREATE POLICY "Admin full access content_blocks" ON public.content_blocks
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access modules" ON public.modules;
CREATE POLICY "Admin full access modules" ON public.modules
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access module_lessons" ON public.module_lessons;
CREATE POLICY "Admin full access module_lessons" ON public.module_lessons
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_locations" ON public.content_locations;
CREATE POLICY "Admin full access content_locations" ON public.content_locations
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_media" ON public.content_media;
CREATE POLICY "Admin full access content_media" ON public.content_media
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access scientific_references" ON public.scientific_references;
CREATE POLICY "Admin full access scientific_references" ON public.scientific_references
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_references" ON public.content_references;
CREATE POLICY "Admin full access content_references" ON public.content_references
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_versions" ON public.content_versions;
CREATE POLICY "Admin full access content_versions" ON public.content_versions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access tags" ON public.tags;
CREATE POLICY "Admin full access tags" ON public.tags
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_tags" ON public.content_tags;
CREATE POLICY "Admin full access content_tags" ON public.content_tags
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access content_relationships" ON public.content_relationships;
CREATE POLICY "Admin full access content_relationships" ON public.content_relationships
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access emotions_encyclopedia" ON public.emotions_encyclopedia;
CREATE POLICY "Admin full access emotions_encyclopedia" ON public.emotions_encyclopedia
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access psychology_insights" ON public.psychology_insights;
CREATE POLICY "Admin full access psychology_insights" ON public.psychology_insights
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
