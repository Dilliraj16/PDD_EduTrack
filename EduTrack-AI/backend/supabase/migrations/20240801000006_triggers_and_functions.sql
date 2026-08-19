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
