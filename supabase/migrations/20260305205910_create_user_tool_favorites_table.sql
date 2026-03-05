/*
  # Create User Tool Favorites Table

  1. New Tables
    - `user_tool_favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `user_id` (uuid) - Reference to the user who favorited the tool
      - `tool_id` (text) - Identifier for the tool (e.g., 'simulations', 'premium', etc.)
      - `created_at` (timestamptz) - When the tool was favorited
  
  2. Security
    - Enable RLS on `user_tool_favorites` table
    - Add policy for users to read their own favorites
    - Add policy for users to insert their own favorites
    - Add policy for users to delete their own favorites
  
  3. Indexes
    - Create unique index on (user_id, tool_id) to prevent duplicates
    - Create index on user_id for fast lookups
*/

CREATE TABLE IF NOT EXISTS user_tool_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_tool_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own favorites"
  ON user_tool_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_tool_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_tool_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS user_tool_favorites_user_tool_idx 
  ON user_tool_favorites(user_id, tool_id);

CREATE INDEX IF NOT EXISTS user_tool_favorites_user_id_idx 
  ON user_tool_favorites(user_id);
