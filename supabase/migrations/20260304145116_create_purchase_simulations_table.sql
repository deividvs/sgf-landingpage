/*
  # Create Purchase Simulations Table
  
  1. New Tables
    - `purchase_simulations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `title` (text) - Title/description of the simulation
      - `suppliers` (jsonb) - Array of supplier data with all calculations
      - `best_supplier_index` (integer) - Index of the best supplier option
      
  2. Security
    - Enable RLS on `purchase_simulations` table
    - Add policy for authenticated users to read their own simulations
    - Add policy for authenticated users to insert their own simulations
    - Add policy for authenticated users to update their own simulations
    - Add policy for authenticated users to delete their own simulations
    
  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS purchase_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  title text DEFAULT '' NOT NULL,
  suppliers jsonb DEFAULT '[]'::jsonb NOT NULL,
  best_supplier_index integer DEFAULT 0 CHECK (best_supplier_index >= 0)
);

ALTER TABLE purchase_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchase simulations"
  ON purchase_simulations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchase simulations"
  ON purchase_simulations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchase simulations"
  ON purchase_simulations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own purchase simulations"
  ON purchase_simulations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_purchase_simulations_user_id 
  ON purchase_simulations(user_id);

CREATE INDEX IF NOT EXISTS idx_purchase_simulations_created_at 
  ON purchase_simulations(created_at DESC);