-- Migration: Create Assignments Table
DROP TABLE IF EXISTS public.assignments CASCADE;
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    due_time TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view and manage their assignments"
ON public.assignments
FOR ALL
USING (auth.uid() = faculty_id)
WITH CHECK (auth.uid() = faculty_id);

-- Wait, students also need to view assignments. We need a select policy for students.
CREATE POLICY "Students can view all assignments"
ON public.assignments
FOR SELECT
USING (true);
