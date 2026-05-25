-- supabase/migrations/003_add_bilingual.sql
-- 为 chunks 表添加双语支持字段（中文翻译 + 音标）

ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS pronunciation TEXT DEFAULT '';
ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS collocations_cn TEXT[] DEFAULT '{}';
ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS example_sentence_cn TEXT DEFAULT '';
ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS synonyms_cn TEXT[] DEFAULT '{}';
