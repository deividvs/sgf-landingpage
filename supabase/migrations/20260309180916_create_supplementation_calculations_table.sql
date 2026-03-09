/*
  # Create Supplementation Calculations Table

  1. New Tables
    - `supplementation_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `title` (text) - Optional simulation title
      
      Input Fields:
      - `quantity_heads` (integer) - Number of animals to be supplemented
      - `average_weight_kg` (numeric) - Average estimated weight of animals
      - `supplementation_type` (text) - Type of supplement
      - `consumption_percentage` (numeric) - Consumption percentage
      - `bag_weight_kg` (numeric) - Standard bag weight in kg (default 30)
      
      Calculated Results:
      - `daily_consumption_kg` (numeric) - Total daily consumption in kg
      - `bags_per_day` (numeric) - Number of bags needed per day
      
  2. Security
    - Enable RLS on `supplementation_calculations` table
    - Add policies for authenticated users to manage their own calculations
    
  3. Important Notes
    - All weight values use numeric type with 2 decimal precision
    - Quantity of heads must be positive integers
    - Consumption percentage typically ranges from 0.1% to 5%
    - Supplementation types: Proteinado, Proteico Energetico, Proteico Energetico Forte, Racao
*/

CREATE TABLE IF NOT EXISTS supplementation_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  title text NOT NULL DEFAULT '',
  
  quantity_heads integer NOT NULL CHECK (quantity_heads > 0),
  average_weight_kg numeric NOT NULL CHECK (average_weight_kg > 0),
  supplementation_type text NOT NULL CHECK (supplementation_type IN ('Proteinado', 'Proteico Energetico', 'Proteico Energetico Forte', 'Racao', 'Personalizado')),
  consumption_percentage numeric NOT NULL CHECK (consumption_percentage > 0 AND consumption_percentage <= 10),
  bag_weight_kg numeric NOT NULL DEFAULT 30 CHECK (bag_weight_kg > 0),
  
  daily_consumption_kg numeric NOT NULL DEFAULT 0 CHECK (daily_consumption_kg >= 0),
  bags_per_day numeric NOT NULL DEFAULT 0 CHECK (bags_per_day >= 0)
);

ALTER TABLE supplementation_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own supplementation calculations"
  ON supplementation_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supplementation calculations"
  ON supplementation_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own supplementation calculations"
  ON supplementation_calculations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own supplementation calculations"
  ON supplementation_calculations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_supplementation_calculations_user_id ON supplementation_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_supplementation_calculations_created_at ON supplementation_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplementation_calculations_type ON supplementation_calculations(supplementation_type);

CREATE TRIGGER update_supplementation_calculations_updated_at
  BEFORE UPDATE ON supplementation_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
