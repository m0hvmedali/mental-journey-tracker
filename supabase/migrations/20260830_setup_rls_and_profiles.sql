-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to handle new user signup and create a profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Now let's secure content_items and content_templates
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Content items policies
-- Anyone can view published content
CREATE POLICY "Published content is viewable by everyone"
  ON content_items FOR SELECT
  USING ( status = 'published' );

-- Admins can do everything on content_items
CREATE POLICY "Admins can do everything on content_items"
  ON content_items
  USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') );

-- Content templates policies
-- Anyone can view templates
CREATE POLICY "Templates are viewable by everyone"
  ON content_templates FOR SELECT
  USING ( true );

-- Admins can do everything on templates
CREATE POLICY "Admins can do everything on templates"
  ON content_templates
  USING ( EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') );
