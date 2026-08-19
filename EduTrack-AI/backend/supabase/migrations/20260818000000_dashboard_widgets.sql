-- Migration: Add Student Productivity Tables
-- Creates the todos and od_requests tables to support the Student Dashboard overhaul

CREATE TABLE
IF NOT EXISTS public.todos
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4
(),
    student_id UUID REFERENCES public.students
(id) ON
DELETE CASCADE,
    task TEXT
NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

CREATE TABLE
IF NOT EXISTS public.od_requests
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4
(),
    student_id UUID REFERENCES public.students
(id) ON
DELETE CASCADE,
    reason TEXT
NOT NULL,
    status TEXT DEFAULT 'pending' CHECK
(status IN
('pending', 'approved', 'rejected')),
    file_url TEXT,
    created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- Enable RLS for Todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage their own todos"
ON public.todos
FOR ALL
USING
(auth.uid
() = student_id)
WITH CHECK
(auth.uid
() = student_id);

-- Enable RLS for OD Requests
ALTER TABLE public.od_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and create their own OD requests"
ON public.od_requests
FOR
SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own OD requests"
ON public.od_requests
FOR
INSERT
WITH CHECK (auth.uid() =
student_id);
