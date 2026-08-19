-- ==========================================
-- EduTrack-AI: Ultra-Safe DB Migration Script
-- ==========================================

-- 1. Create Role Enum Safely
DO $
$ 
BEGIN
    CREATE TYPE user_role AS ENUM
    ('student', 'faculty', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table Sync
CREATE TABLE
IF NOT EXISTS public.profiles
(
  id uuid references auth.users on
delete cascade primary key,
  full_name text,
  created_at timestamp
with time zone default timezone
('utc'::text, now
()) not null
);

ALTER TABLE public.profiles 
  ADD COLUMN
IF NOT EXISTS role user_role not null default 'student',
ADD COLUMN
IF NOT EXISTS roll_number text;

-- 3. Courses Table Sync
CREATE TABLE
IF NOT EXISTS public.courses
(
  id uuid default gen_random_uuid
() primary key,
  name text,
  code text,
  created_at timestamp
with time zone default timezone
('utc'::text, now
()) not null
);

ALTER TABLE public.courses
  ADD COLUMN
IF NOT EXISTS faculty_id uuid references public.profiles
(id) on
delete cascade;

-- 4. Course Enrollments Sync
CREATE TABLE
IF NOT EXISTS public.course_enrollments
(
  id uuid default gen_random_uuid
() primary key,
  course_id uuid references public.courses
(id) on
delete cascade,
  student_id uuid
references public.profiles
(id) on
delete cascade,
  enrolled_at timestamp
with time zone default timezone
('utc'::text, now
()) not null
);

-- 5. Course Results Sync
CREATE TABLE
IF NOT EXISTS public.course_results
(
  id uuid default gen_random_uuid
() primary key,
  course_id uuid references public.courses
(id) on
delete cascade,
  student_id uuid
references public.profiles
(id) on
delete cascade,
  assigned_at timestamp
with time zone default timezone
('utc'::text, now
()) not null
);

ALTER TABLE public.course_results
  ADD COLUMN
IF NOT EXISTS faculty_id uuid references public.profiles
(id) on
delete cascade,
ADD COLUMN
IF NOT EXISTS grade text,
ADD COLUMN
IF NOT EXISTS status text check
(status in
('PASS', 'FAIL', 'PENDING'));

-- ==========================================
-- Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_results ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Drop existing policies safely to avoid Duplicate errors
-- ==========================================
DO $$ 
BEGIN
    DROP POLICY
    IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    DROP POLICY
    IF EXISTS "Users update own profile" ON public.profiles;
    DROP POLICY
    IF EXISTS "Courses viewable by everyone" ON public.courses;
    DROP POLICY
    IF EXISTS "Faculty can insert courses" ON public.courses;
    DROP POLICY
    IF EXISTS "Faculty update own courses" ON public.courses;
    DROP POLICY
    IF EXISTS "Students see own results" ON public.course_results;
    DROP POLICY
    IF EXISTS "Faculty insert results" ON public.course_results;
    DROP POLICY
    IF EXISTS "Faculty update results" ON public.course_results;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- ==========================================
-- Re-Create Policies
-- ==========================================
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR
UPDATE USING (auth.uid()
= id);

CREATE POLICY "Courses viewable by everyone" ON public.courses FOR
SELECT USING (true);
CREATE POLICY "Faculty can insert courses" ON public.courses FOR
INSERT WITH CHECK
    (
    EXISTS (SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
);
CREATE POLICY "Faculty update own courses" ON public.courses FOR
UPDATE USING (faculty_id = auth.uid()
);

CREATE POLICY "Students see own results" ON public.course_results FOR
SELECT USING (student_id = auth.uid() OR faculty_id = auth.uid());
CREATE POLICY "Faculty insert results" ON public.course_results FOR
INSERT WITH CHECK
    (faculty_id =
auth.uid()

);
CREATE POLICY "Faculty update results" ON public.course_results FOR
UPDATE USING (faculty_id = auth.uid()
);
