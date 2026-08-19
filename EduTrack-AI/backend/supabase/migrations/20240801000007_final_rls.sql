-- EduTrack AI - Final Security Lockdown
-- Enables RLS on all remaining unrestricted tables to secure the Data API

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgpa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- From ERP Schema (if these exist)
ALTER TABLE IF EXISTS public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exam_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty_class_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty_subject_mapping ENABLE ROW LEVEL SECURITY;

-- Read-Only Access for Authenticated Users on Global Tables
CREATE POLICY "View Departments" ON public.departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "View Courses" ON public.courses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "View Subjects" ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');

-- Personal Data Access (Only view your own data)
CREATE POLICY "View Own Enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "View Own Results" ON public.results FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "View Own CGPA" ON public.cgpa FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Manage Own Notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage Own Settings" ON public.settings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "View Own Activity Logs" ON public.activity_logs FOR SELECT USING (user_id = auth.uid());
