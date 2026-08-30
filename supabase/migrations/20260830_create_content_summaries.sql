-- Migration: Create content_summaries table for Persistent AI Summary Cache
CREATE TABLE IF NOT EXISTS public.content_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  summary TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'ar',
  model VARCHAR(100) NOT NULL DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_summary_per_content_hash_lang UNIQUE (content_id, content_hash, language)
);

-- Index for fast cache lookups by content_id, content_hash, and language
CREATE INDEX IF NOT EXISTS idx_content_summaries_lookup 
ON public.content_summaries (content_id, content_hash, language);

-- Enable Row Level Security (RLS)
ALTER TABLE public.content_summaries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached summaries
DROP POLICY IF EXISTS "Public read access for content_summaries" ON public.content_summaries;
CREATE POLICY "Public read access for content_summaries" 
ON public.content_summaries FOR SELECT 
USING (true);

-- Allow public / authenticated insert access for content_summaries
DROP POLICY IF EXISTS "Public insert access for content_summaries" ON public.content_summaries;
CREATE POLICY "Public insert access for content_summaries" 
ON public.content_summaries FOR INSERT 
WITH CHECK (true);

-- Allow public / authenticated update access for content_summaries
DROP POLICY IF EXISTS "Public update access for content_summaries" ON public.content_summaries;
CREATE POLICY "Public update access for content_summaries" 
ON public.content_summaries FOR UPDATE 
USING (true);
