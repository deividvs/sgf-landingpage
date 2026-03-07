/*
  # Create carcass yield calculations table

  1. New Tables
    - `carcass_yield_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `title` (text, optional title for the calculation)
      - `quantity_animals` (integer, number of animals)
      - `gmd_kg` (numeric, average daily gain in kg)
      - `carcass_yield_percentage` (numeric, carcass yield percentage)
      - `final_weight_kg` (numeric, optional final weight)
      - `arroba_price` (numeric, optional arroba price)
      - `total_carcass_weight_kg` (numeric, calculated total carcass weight)
      - `total_arrobas` (numeric, calculated total arrobas)
      - `total_revenue` (numeric, calculated total revenue)
      - `revenue_per_animal` (numeric, calculated revenue per animal)

  2. Security
    - Enable RLS on `carcass_yield_calculations` table
    - Add policies for authenticated users to manage their own calculations
*/

CREATE TABLE IF NOT EXISTS carcass_yield_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  title text DEFAULT '',
  quantity_animals integer NOT NULL CHECK (quantity_animals > 0),
  gmd_kg numeric NOT NULL CHECK (gmd_kg > 0 AND gmd_kg <= 3),
  carcass_yield_percentage numeric NOT NULL CHECK (carcass_yield_percentage > 0 AND carcass_yield_percentage <= 100),
  final_weight_kg numeric CHECK (final_weight_kg > 0),
  arroba_price numeric CHECK (arroba_price > 0),
  total_carcass_weight_kg numeric DEFAULT 0 CHECK (total_carcass_weight_kg >= 0),
  total_arrobas numeric DEFAULT 0 CHECK (total_arrobas >= 0),
  total_revenue numeric DEFAULT 0 CHECK (total_revenue >= 0),
  revenue_per_animal numeric DEFAULT 0 CHECK (revenue_per_animal >= 0)
);

ALTER TABLE carcass_yield_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own carcass yield calculations"
  ON carcass_yield_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own carcass yield calculations"
  ON carcass_yield_calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carcass yield calculations"
  ON carcass_yield_calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own carcass yield calculations"
  ON carcass_yield_calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_carcass_yield_calculations_user_id 
  ON carcass_yield_calculations(user_id);

CREATE INDEX IF NOT EXISTS idx_carcass_yield_calculations_created_at 
  ON carcass_yield_calculations(created_at DESC);