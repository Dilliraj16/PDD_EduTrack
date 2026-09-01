-- Migration: fix_created_by_constraint
-- Loosens the foreign key from public.faculty to auth.users in case of out-of-sync legacy accounts
-- and adds bulletproof UUID parsing to the hook

ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_created_by_fkey;
ALTER TABLE public.students ADD CONSTRAINT students_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  parsed_created_by UUID := NULL;
BEGIN
  -- Insert into public.profiles for unified things like chat
  INSERT INTO public.profiles (id, avatar_url, phone_number, address)
  VALUES (new.id, NULL, NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- Attempt to safely parse created_by
  BEGIN
    IF new.raw_user_meta_data->>'created_by' NOT IN ('', 'undefined', 'null') THEN
        parsed_created_by := (new.raw_user_meta_data->>'created_by')::uuid;
    END IF;
  EXCEPTION WHEN others THEN
    parsed_created_by := NULL;
  END;

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
      parsed_created_by
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
