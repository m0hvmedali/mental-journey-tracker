-- ==============================================================================
-- 1. Profiles Table & Roles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow individual update to their own profile" ON public.profiles;
CREATE POLICY "Allow individual update to their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', new.email),
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', new.email),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. CMS Content & Templates
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.content_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  content_markdown TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read templates" ON public.content_templates;
CREATE POLICY "Public read templates" ON public.content_templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage templates" ON public.content_templates;
CREATE POLICY "Admin manage templates" ON public.content_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Public read published content" ON public.content_items;
CREATE POLICY "Public read published content" ON public.content_items FOR SELECT USING (
  status = 'published' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Admin insert content" ON public.content_items;
CREATE POLICY "Admin insert content" ON public.content_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Admin update content" ON public.content_items;
CREATE POLICY "Admin update content" ON public.content_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Admin delete content" ON public.content_items;
CREATE POLICY "Admin delete content" ON public.content_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ==============================================================================
-- 3. Conversations & Messages
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  title TEXT NOT NULL DEFAULT 'محادثة جديدة',
  messageCount INT DEFAULT 0,
  state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id TEXT DEFAULT 'guest',
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id TEXT;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own conversations" ON public.conversations;
CREATE POLICY "Users manage their own conversations" ON public.conversations FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

DROP POLICY IF EXISTS "Users manage their own messages" ON public.messages;
CREATE POLICY "Users manage their own messages" ON public.messages FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

-- ==============================================================================
-- 4. Tasks & Sticky Notes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  title TEXT NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  due TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

CREATE TABLE IF NOT EXISTS public.user_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  content TEXT,
  color TEXT DEFAULT 'emerald',
  source_path TEXT,
  source_title TEXT,
  source_type TEXT DEFAULT 'page',
  position JSONB DEFAULT '{"x": 20, "y": 80}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.user_notes ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their tasks" ON public.tasks;
CREATE POLICY "Users manage their tasks" ON public.tasks FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

DROP POLICY IF EXISTS "Users manage their notes" ON public.user_notes;
CREATE POLICY "Users manage their notes" ON public.user_notes FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

-- ==============================================================================
-- 5. Logs & Personal Records (Diary, Emotions, Reappraisal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.diary_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  ts BIGINT,
  title TEXT,
  content TEXT,
  media_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.diary_logs ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

CREATE TABLE IF NOT EXISTS public.emotion_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  ts BIGINT,
  emotion TEXT,
  intensity INT,
  triggers TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.emotion_logs ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

CREATE TABLE IF NOT EXISTS public.reappraisal_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'guest',
  ts BIGINT,
  situation TEXT,
  automatic_thought TEXT,
  cognitive_distortions TEXT[],
  alternative_thought TEXT,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.reappraisal_logs ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'guest';

ALTER TABLE public.diary_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reappraisal_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their diary logs" ON public.diary_logs;
CREATE POLICY "Users manage their diary logs" ON public.diary_logs FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

DROP POLICY IF EXISTS "Users manage their emotion logs" ON public.emotion_logs;
CREATE POLICY "Users manage their emotion logs" ON public.emotion_logs FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);

DROP POLICY IF EXISTS "Users manage their reappraisal logs" ON public.reappraisal_logs;
CREATE POLICY "Users manage their reappraisal logs" ON public.reappraisal_logs FOR ALL USING (
  user_id = auth.uid()::text OR user_id = 'guest' OR user_id IS NULL
);
