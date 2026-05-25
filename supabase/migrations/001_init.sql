-- supabase/migrations/001_init.sql
-- MVP complete database init: tables + RLS + seed data

-- ============================================================
-- 1. Chunks table (public read)
-- ============================================================
CREATE TABLE public.chunks (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  part_of_speech TEXT,
  band_level TEXT,
  frequency_score INTEGER DEFAULT 0,
  topics TEXT[],
  modules TEXT[],
  collocations TEXT[],
  example_sentence TEXT,
  synonyms TEXT[],
  common_mistakes TEXT[],
  ielts_context TEXT,
  last_updated DATE DEFAULT '2026-05-01'
);

ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chunks_public_read" ON public.chunks FOR SELECT USING (true);

-- ============================================================
-- 2. User profiles table
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  target_band TEXT DEFAULT '6.0',
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. Favorites table
-- ============================================================
CREATE TABLE public.favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_id TEXT REFERENCES public.chunks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, chunk_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_self_read" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_self_insert" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_self_delete" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. User chunk progress table
-- ============================================================
CREATE TABLE public.user_chunk_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_id TEXT REFERENCES public.chunks(id) ON DELETE CASCADE,
  mastery_score INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, chunk_id)
);

ALTER TABLE public.user_chunk_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_self_read" ON public.user_chunk_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_self_insert" ON public.user_chunk_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_self_update" ON public.user_chunk_progress FOR UPDATE USING (auth.uid() = user_id);
