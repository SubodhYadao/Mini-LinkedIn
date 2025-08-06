CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone." ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts." ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts." ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts." ON posts FOR DELETE USING (auth.uid() = user_id);

-- Function to create a public.users entry on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.users (id, email)
VALUES (NEW.id, NEW.email);
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new auth.users signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a new RLS policy to allow authenticated users to view all profiles.
-- This is necessary for displaying author names on posts by other users.
CREATE POLICY "Authenticated users can view all profiles."
ON users FOR SELECT
USING (auth.role() = 'authenticated');

-- You might want to review your existing policies to ensure there are no conflicts.
-- For example, if you had a very restrictive policy, ensure this new one takes precedence
-- or is combined correctly. The default "Users can view their own profile" is still useful
-- for specific profile page access, but this new one broadens visibility for the feed.

