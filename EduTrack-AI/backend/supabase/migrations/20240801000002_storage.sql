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
