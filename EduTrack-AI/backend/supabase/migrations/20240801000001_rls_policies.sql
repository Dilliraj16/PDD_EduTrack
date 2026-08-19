-- EduTrack AI - Row Level Security Policies

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY admin_all ON public.students FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY admin_all_faculty ON public.faculty FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- Students
CREATE POLICY student_self_view ON public.students FOR SELECT USING (auth.uid() = id);
CREATE POLICY student_self_attendance ON public.attendance FOR SELECT USING (student_id = auth.uid());
CREATE POLICY student_view_assignments ON public.assignments FOR SELECT USING (TRUE); -- Everyone can view assignments of their subjects (simplified)
CREATE POLICY student_self_submissions ON public.assignment_submissions FOR ALL USING (student_id = auth.uid());

-- Faculty
CREATE POLICY faculty_self_view ON public.faculty FOR SELECT USING (auth.uid() = id);
CREATE POLICY faculty_manage_attendance ON public.attendance FOR ALL USING (recorded_by = auth.uid());
CREATE POLICY faculty_manage_assignments ON public.assignments FOR ALL USING (created_by = auth.uid());

