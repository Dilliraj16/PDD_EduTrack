-- 🤖 AI Mode Schema Extensions
-- Creates isolation tables for AI interactions to protect core academic data.

-- AI Conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty')),
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Study Plans
CREATE TABLE IF NOT EXISTS public.ai_study_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    exam_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Study Plan Tasks
CREATE TABLE IF NOT EXISTS public.ai_study_plan_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES public.ai_study_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Quiz Attempts
CREATE TABLE IF NOT EXISTS public.ai_quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_study_plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- SECURITY POLICIES (Strict isolation per user)
-- -------------------------------------------------------------

-- Users can manage their own conversations
CREATE POLICY "Users can manage their own conversations" 
ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- Users can manage messages in their conversations
CREATE POLICY "Users can manage messages in their conversations" 
ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Students manage their own study plans
CREATE POLICY "Students manage their own study plans" 
ON public.ai_study_plans FOR ALL USING (auth.uid() = student_id);

-- Students manage their own study plan tasks
CREATE POLICY "Students manage their own study plan tasks" 
ON public.ai_study_plan_tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_study_plans WHERE id = plan_id AND student_id = auth.uid())
);

-- Students manage their own quiz attempts
CREATE POLICY "Students manage their own quiz attempts" 
ON public.ai_quiz_attempts FOR ALL USING (auth.uid() = student_id);

-- -------------------------------------------------------------
-- AI RPC FUNCTIONS (Backend tools for Faculty/Student Insights)
-- -------------------------------------------------------------

-- Faculty Tool: Get Class Performance Summary
-- Checks if the user is faculty before returning mock aggregate for now, we will link it to courses later.
CREATE OR REPLACE FUNCTION get_class_performance(faculty_uid UUID)
RETURNS JSONB AS $$
DECLARE
    is_faculty BOOLEAN;
    result JSONB;
BEGIN
    SELECT (raw_user_meta_data->>'role') = 'faculty' INTO is_faculty 
    FROM auth.users WHERE id = faculty_uid;

    IF NOT is_faculty THEN
        RAISE EXCEPTION 'Unauthorized: Only faculty can view class performance';
    END IF;

    -- Aggregate logic goes here. For now, fetch overall system stats for testing.
    -- We can join users, assignments, and attendance.
    -- (This gets fleshed out later)
    SELECT json_build_object(
        'average_score', 68,
        'attendance', 84,
        'assignments', 88
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
