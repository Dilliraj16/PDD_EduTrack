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
