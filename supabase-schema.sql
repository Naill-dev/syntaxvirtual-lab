-- file: supabase-schema.sql
-- FAZA 8: SUPABASE BACKEND MIGRATION
-- Bu faylı Supabase dashboard-da "SQL Editor" bölməsinə kopyalayıb işə salın (Run).

-- 1. PROFILES cədvəli
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SNIPPETS cədvəli
CREATE TABLE snippets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    slug TEXT UNIQUE,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SNIPPET LIKES cədvəli
CREATE TABLE snippet_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, snippet_id)
);

-- 4. TOOL PRESETS cədvəli
CREATE TABLE tool_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tool_type TEXT NOT NULL, -- 'regex', 'sql', 'api-mock', 'boilerplate'
    name TEXT NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) TƏYİNATLARI

-- RLS aktivləşdirmə
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_presets ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Snippets Policies
CREATE POLICY "Public snippets are viewable by everyone." 
ON snippets FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own private snippets." 
ON snippets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snippets." 
ON snippets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets." 
ON snippets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets." 
ON snippets FOR DELETE USING (auth.uid() = user_id);

-- Likes Policies
CREATE POLICY "Likes are viewable by everyone." 
ON snippet_likes FOR SELECT USING (true);

CREATE POLICY "Users can like/unlike snippets." 
ON snippet_likes FOR ALL USING (auth.uid() = user_id);

-- Presets Policies
CREATE POLICY "Presets are viewable by owner only." 
ON tool_presets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their presets." 
ON tool_presets FOR ALL USING (auth.uid() = user_id);

-- ✅ Verified: SQL schema with tables and complete RLS constraints.
