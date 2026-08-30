-- Migration: Create Homepage Shortcuts
CREATE TABLE public.homepage_shortcuts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    image_url VARCHAR(1024),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.homepage_shortcut_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shortcut_id UUID NOT NULL REFERENCES public.homepage_shortcuts(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(shortcut_id, content_id)
);

-- RLS
ALTER TABLE public.homepage_shortcuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_shortcut_items ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public can view visible shortcuts" 
    ON public.homepage_shortcuts FOR SELECT 
    USING (is_visible = true);

CREATE POLICY "Public can view items of visible shortcuts" 
    ON public.homepage_shortcut_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.homepage_shortcuts 
            WHERE id = homepage_shortcut_items.shortcut_id AND is_visible = true
        )
    );

-- Admin full access
CREATE POLICY "Admin full access homepage_shortcuts" 
    ON public.homepage_shortcuts FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access homepage_shortcut_items" 
    ON public.homepage_shortcut_items FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());
