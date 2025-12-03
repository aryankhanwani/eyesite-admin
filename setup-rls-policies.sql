-- Row Level Security Policies for blogs table
-- Run this in Supabase SQL Editor after creating the tables

-- Enable RLS on blogs table (if not already enabled)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to blogs
-- This allows anyone (including unauthenticated users) to SELECT from blogs
CREATE POLICY "Public blogs are viewable by everyone"
ON blogs FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert blogs
CREATE POLICY "Authenticated users can insert blogs"
ON blogs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update blogs
CREATE POLICY "Authenticated users can update blogs"
ON blogs FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete blogs
CREATE POLICY "Authenticated users can delete blogs"
ON blogs FOR DELETE
USING (auth.role() = 'authenticated');

-- If you want to be more restrictive and only allow admins:
-- You can replace the INSERT/UPDATE/DELETE policies above with:
-- 
-- CREATE POLICY "Only admins can modify blogs"
-- ON blogs FOR ALL
-- USING (
--   EXISTS (
--     SELECT 1 FROM admin_users 
--     WHERE admin_users.auth_user_id = auth.uid() 
--     AND admin_users.role = 'admin'
--   )
-- );

