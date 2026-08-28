-- Migration: Add time_frame column to todos table
-- This allows tasks to be categorized as daily, weekly, or monthly goals in the AI Dashboard.

ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS time_frame TEXT DEFAULT 'daily' CHECK (time_frame IN ('daily', 'weekly', 'monthly'));
