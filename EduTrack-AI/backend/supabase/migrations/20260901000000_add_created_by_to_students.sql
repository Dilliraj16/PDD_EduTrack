-- Migration: add_created_by_to_students
-- Associates a student exclusively with the faculty member who created their account

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.faculty(id) ON DELETE SET NULL;

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
    INSERT INTO public.students (id, email, first_name, last_name, enrollment_number, current_semester, created_by)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'first_name', Split_part(new.email, '@', 1)), 
      '', 
      COALESCE(new.raw_user_meta_data->>'registration_number', 'REG-' || substring(md5(random()::text) from 1 for 6)),
      1,
      NULLIF(new.raw_user_meta_data->>'created_by', '')::uuid
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
