-- Add a new RLS policy to allow authenticated users to view all profiles.
-- This is necessary for displaying author names on posts by other users.
CREATE POLICY "Authenticated users can view all profiles."
ON users FOR SELECT
USING (auth.role() = 'authenticated');
