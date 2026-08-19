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
CREATE TABLE IF NOT EXISTS public.subject_chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE UNIQUE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.subject_chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'MODERATOR')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

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
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_preferences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dashboard_widgets;

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
