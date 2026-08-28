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
