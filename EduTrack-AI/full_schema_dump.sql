-- EduTrack AI - Initial Supabase Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables connected to auth.users
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    enrollment_number TEXT UNIQUE,
    current_semester INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Academic Tables
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    head_of_department UUID REFERENCES public.faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    total_semesters INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    course_id UUID REFERENCES public.courses(id),
    semester INT NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id),
    credits INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id)
);

-- Tracking and Operations
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
    recorded_by UUID REFERENCES public.faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, date)
);

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    file_url TEXT,
    grade TEXT,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    total_marks DECIMAL(5,2) DEFAULT 100,
    grade TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.cgpa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    sgpa DECIMAL(4,2),
    cumulative_cgpa DECIMAL(4,2),
    UNIQUE(student_id, semester)
);

-- Realtime & Chat
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id),
    content TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT, -- 'alert', 'reminder', 'announcement'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings & Logs
CREATE TABLE IF NOT EXISTS public.settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'en'
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
CREATE POLICY faculty_manage_assignments ON public.assignments FOR ALL USING (faculty_id = auth.uid());

-- EduTrack AI - Storage Buckets

-- Files Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Images Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (simplified)
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

CREATE POLICY "Anyone can upload an image." 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Files are publicly accessible." 
ON storage.objects FOR SELECT USING ( bucket_id = 'files' );

CREATE POLICY "Anyone can upload a file." 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'files' );

-- Phase 5 Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
('assignment-submissions', 'assignment-submissions', false),
('chat-images', 'chat-images', true),
('chat-files', 'chat-files', true),
('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Basic Policies for new buckets
CREATE POLICY "Public profile images read access" 
ON storage.objects FOR SELECT USING ( bucket_id = 'profile-images' );

CREATE POLICY "Authenticated users can upload profile image" 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated read access for assignments" 
ON storage.objects FOR SELECT USING ( bucket_id = 'assignment-submissions' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated submit assignments" 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'assignment-submissions' AND auth.role() = 'authenticated' );

CREATE POLICY "Public read for chat media" 
ON storage.objects FOR SELECT USING ( bucket_id IN ('chat-images', 'chat-files') );

CREATE POLICY "Authenticated upload for chat media" 
ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('chat-images', 'chat-files') AND auth.role() = 'authenticated' );
-- EduTrack AI Advanced Security & Logging Schema
-- Phase 2 Deployments: Authentication Metadata, Devices, Settings, Activity Logs.

-- ==========================================
-- PROFILES & SETTINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT,
    cover_image_url TEXT,
    biography TEXT,
    skills TEXT[],
    achievements TEXT[],
    interests TEXT[],
    custom_preferences JSONB DEFAULT '{}'::jsonb,
    is_profile_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.theme_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    mode TEXT DEFAULT 'system' CHECK (mode IN ('light', 'dark', 'system')),
    accent_color TEXT DEFAULT 'blue',
    use_custom_fonts BOOLEAN DEFAULT false,
    reduce_animations BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.privacy_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    show_online_status BOOLEAN DEFAULT true,
    show_email BOOLEAN DEFAULT false,
    allow_data_collection BOOLEAN DEFAULT true,
    share_results_with_advisors BOOLEAN DEFAULT true
);

-- ==========================================
-- SESSIONS & DEVICES (SECURITY)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    browser TEXT,
    ip_address TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_trusted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id),
    session_token TEXT UNIQUE NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'terminated', 'expired'))
);

-- ==========================================
-- AUDIT & LOGGING (COMPLIANCE)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('login_success', 'login_failed', 'password_change', 'mfa_enabled', 'mfa_disabled', 'account_locked')),
    ip_address TEXT,
    device_info TEXT,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    target_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    description TEXT,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- COMMUNICATION & OTP
-- ==========================================
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.otp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_method TEXT NOT NULL CHECK (contact_method IN ('email', 'sms')),
    contact_value TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- EXPORT ENGINES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.pdf_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    term_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    generated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- RLS POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own theme settings" ON public.theme_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own theme settings" ON public.theme_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own privacy configs" ON public.privacy_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own privacy configs" ON public.privacy_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own devices" ON public.devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own devices" ON public.devices FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
-- Activity logs are immutable, no UPDATE or DELETE policies.
-- EduTrack AI - Master ERP Expansion Schema
-- Contains the extended tables mapped for the 50-table production requirements

-- 1. Profiles & Deep Mappings
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    phone_number TEXT UNIQUE,
    address TEXT,
    date_of_birth DATE,
    blood_group TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faculty_subject_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(faculty_id, subject_id, semester)
);

CREATE TABLE IF NOT EXISTS public.faculty_class_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    section TEXT NOT NULL,
    is_class_advisor BOOLEAN DEFAULT FALSE,
    UNIQUE(department_id, semester, section)
);

-- 2. Advanced Academics & Timetables
CREATE TABLE IF NOT EXISTS public.homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timetable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id),
    semester INT NOT NULL,
    section TEXT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID REFERENCES public.subjects(id),
    faculty_id UUID REFERENCES public.faculty(id),
    room_number TEXT
);

CREATE TABLE IF NOT EXISTS public.exam_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('MIDTERM', 'FINAL', 'INTERNAL')),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Administration & HR
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES public.admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.od_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    proof_url TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES public.faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Finance & Payments
CREATE TABLE IF NOT EXISTS public.fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    fee_type TEXT DEFAULT 'TUITION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_id UUID REFERENCES public.fees(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED'))
);

-- 5. Deep Logging & Auditing (Enterprise Requirements)
CREATE TABLE IF NOT EXISTS public.login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'SUCCESS'
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_name TEXT,
    status TEXT DEFAULT 'SENT',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pdf_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL, -- e.g., 'SEMESTER_RESULT', 'FEE_RECEIPT'
    file_url TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    certificate_type TEXT NOT NULL,
    issue_date DATE NOT NULL,
    file_url TEXT NOT NULL,
    digital_signature TEXT UNIQUE
);

-- 6. Role Based Access Control (RBAC) Expansion
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT UNIQUE NOT NULL -- e.g., 'publish_results', 'approve_leaves'
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Triggers for automatic logging
CREATE OR REPLACE FUNCTION log_login_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.login_history(user_id, status)
    VALUES (NEW.id, 'SUCCESS');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- EduTrack AI - Master Realtime & UI Extensions
-- Encompasses Chat, Theme Sync, and Widget tracking across Web and Mobile

-- 1. Global Themes & User Preferences
CREATE TABLE IF NOT EXISTS public.theme_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    app_theme TEXT DEFAULT 'system' CHECK (app_theme IN ('light', 'dark', 'system')),
    accent_color TEXT DEFAULT 'blue',
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Dashboard Widgets System
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    widget_type TEXT NOT NULL, -- e.g., 'attendance_ring', 'priority_goals', 'timetable'
    is_visible BOOLEAN DEFAULT TRUE,
    position_index INT DEFAULT 0,
    UNIQUE(user_id, widget_type)
);

-- 3. Advanced Subject Chat (Realtime Constraints)
DROP TABLE IF EXISTS public.subject_chat_rooms CASCADE;
CREATE TABLE IF NOT EXISTS public.subject_chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE UNIQUE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TABLE IF EXISTS public.chat_participants CASCADE;
CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.subject_chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'MODERATOR')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

DROP TABLE IF EXISTS public.chat_messages CASCADE;
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.subject_chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    attachment_url TEXT,
    attachment_type TEXT, -- image, pdf, voice
    is_pinned BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activate Supabase Realtime implicitly for these tables
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_preferences;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.dashboard_widgets;

-- Trigger to auto-create theme profile per user on register
CREATE OR REPLACE FUNCTION initialize_user_theme()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.theme_preferences(user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Map this trigger ONLY if it doesn't already exist from old logs
DROP TRIGGER IF EXISTS on_auth_user_created_theme ON auth.users;
CREATE TRIGGER on_auth_user_created_theme
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION initialize_user_theme();

-- Chat RLS Constraints
ALTER TABLE public.subject_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 1. Chat Rooms Viewable by Enrolled Students or Subject Faculty
CREATE POLICY "View Chat Rooms if Enrolled or Faculty"
ON public.subject_chat_rooms FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.enrollments e WHERE e.subject_id = public.subject_chat_rooms.subject_id AND e.student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.subjects s WHERE s.id = public.subject_chat_rooms.subject_id AND s.faculty_id = auth.uid())
);

-- 2. Participants Viewable
CREATE POLICY "View Chat Participants"
ON public.chat_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.room_id = public.chat_participants.room_id AND cp.user_id = auth.uid())
);

-- 3. Messages Viewable/Insertable by Participants
CREATE POLICY "View Chat Messages"
ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.room_id = public.chat_messages.room_id AND cp.user_id = auth.uid())
);

CREATE POLICY "Insert Chat Messages"
ON public.chat_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.room_id = public.chat_messages.room_id AND cp.user_id = auth.uid())
);
-- EduTrack AI - Triggers for Notifications and Activity Logs

-- 1. Notify Students on New Assignment
CREATE OR REPLACE FUNCTION notify_students_new_assignment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
        e.student_id,
        'New Assignment: ' || NEW.title,
        'A new assignment for your subject has been posted.',
        'alert'
    FROM public.enrollments e
    WHERE e.subject_id = NEW.subject_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_assignment
    AFTER INSERT ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION notify_students_new_assignment();

-- 2. Notify Student on Grade Posted
CREATE OR REPLACE FUNCTION notify_student_grade_posted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.grade IS NOT NULL AND (OLD.grade IS NULL OR OLD.grade != NEW.grade) THEN
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            NEW.student_id,
            'Grade Posted',
            'Your grade for an assignment has been posted.',
            'alert'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_grade_posted
    AFTER UPDATE ON public.assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION notify_student_grade_posted();

-- 3. Activity Log Generic Trigger (Example for profile updates)
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.activity_logs (user_id, action, details)
    VALUES (NEW.id, 'PROFILE_UPDATED', json_build_object('table', TG_TABLE_NAME));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_student_update
    AFTER UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION log_user_activity();
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
-- EduTrack AI - Absolute Final Security Lockdown
-- This script dynamically enables Row Level Security (RLS) on EVERY single table in the 'public' schema, 
-- completely eliminating all red [UNRESTRICTED] warnings at once.

DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Loop through all tables in the public schema
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        -- Enable RLS for each table dynamically
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_record.tablename);
    END LOOP;
END;
$$;
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
-- Syncs auth.users into students, faculty, and profiles tables automatically upon signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into public.profiles for unified things like chat
  INSERT INTO public.profiles (id, avatar_url, phone_number, address)
  VALUES (new.id, NULL, NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- Insert into specific role table based on user_metadata.role
  IF new.raw_user_meta_data->>'role' = 'faculty' THEN
    INSERT INTO public.faculty (id, email, first_name, last_name, department)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'first_name', Split_part(new.email, '@', 1)), 
      '',
      COALESCE(new.raw_user_meta_data->>'department', 'general')
    )
    ON CONFLICT (id) DO NOTHING;
  ELSE
    -- Default to student
    INSERT INTO public.students (id, email, first_name, last_name, enrollment_number, current_semester)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'first_name', Split_part(new.email, '@', 1)), 
      '', 
      COALESCE(new.raw_user_meta_data->>'registration_number', 'REG-' || substring(md5(random()::text) from 1 for 6)),
      1
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists to avoid conflicts, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Insert sample courses if they don't already exist
INSERT INTO public.courses (code, name)
VALUES 
    ('CS101', 'Intro to Computer Science'),
    ('MATH201', 'Advanced Calculus'),
    ('PHY105', 'Quantum Physics')
ON CONFLICT (code) DO NOTHING;

-- Insert sample grades into course_results for an example student (replace 'replace-with-student-id' if necessary)
-- We will fetch any random student to link these to, or we can just insert them for the first 5 students to ensure it works.
DO $$ 
DECLARE
    student_rec record;
BEGIN
    FOR student_rec IN SELECT id FROM public.students LIMIT 5 LOOP
        INSERT INTO public.course_results (student_id, course_code, grade, status)
        VALUES 
            (student_rec.id, 'CS101', 'S', 'PASS'),
            (student_rec.id, 'MATH201', 'A', 'PASS'),
            (student_rec.id, 'PHY105', 'B', 'PASS')
        ON CONFLICT (student_id, course_code) DO UPDATE 
        SET grade = EXCLUDED.grade, status = EXCLUDED.status;
    END LOOP;
END $$;
-- Migration: Create Assignments Table
DROP TABLE IF EXISTS public.assignments CASCADE;
CREATE TABLE IF NOT EXISTS public.assignments (
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
-- Migration: Add time_frame column to todos table
-- This allows tasks to be categorized as daily, weekly, or monthly goals in the AI Dashboard.

ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS time_frame TEXT DEFAULT 'daily' CHECK (time_frame IN ('daily', 'weekly', 'monthly'));
-- ðŸ¤– AI Mode Schema Extensions
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

