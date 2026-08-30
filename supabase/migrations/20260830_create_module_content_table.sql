-- ============================================================================
-- MODULE CONTENT JUNCTION TABLE (CMS Content Integration Inside Modules)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.module_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT uq_module_content_pair UNIQUE (module_id, content_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_module_content_module_id ON public.module_content(module_id);
CREATE INDEX IF NOT EXISTS idx_module_content_content_id ON public.module_content(content_id);
CREATE INDEX IF NOT EXISTS idx_module_content_sort ON public.module_content(module_id, sort_order ASC, created_at ASC);

-- Enable RLS
ALTER TABLE public.module_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read published module content" ON public.module_content;
DROP POLICY IF EXISTS "Admin full access on module_content" ON public.module_content;

-- Public read published items belonging to published modules
CREATE POLICY "Public read published module content"
  ON public.module_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      WHERE m.id = module_content.module_id AND m.status = 'published'
    )
    AND
    EXISTS (
      SELECT 1 FROM public.content c
      WHERE c.id = module_content.content_id AND c.status = 'published'
    )
  );

-- Admin CRUD access
CREATE POLICY "Admin full access on module_content"
  ON public.module_content
  FOR ALL
  TO authenticated
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');
