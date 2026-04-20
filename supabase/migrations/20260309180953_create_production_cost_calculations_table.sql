/*
  # Create Production Cost Calculations Table

  1. New Tables
    - `production_cost_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `title` (text) - Title/description of the calculation
      
      Input Fields:
      - `quantity_animals` (integer) - Number of animals
      - `lease_monthly` (numeric) - Monthly lease cost
      - `supplementation_monthly` (numeric) - Monthly supplementation cost
      - `labor_monthly` (numeric) - Monthly labor cost
      - `variable_costs_monthly` (numeric) - Other monthly variable costs
      - `gmd_kg` (numeric) - Average daily gain in kg (GMD)
      
      Calculated Results:
      - `total_monthly_expense` (numeric) - Total monthly expenses
      - `monthly_expense_per_animal` (numeric) - Monthly expense per animal
      - `daily_cost_per_animal` (numeric) - Daily cost per animal
      - `days_per_arroba` (numeric) - Days needed to produce one arroba
      - `cost_per_arroba` (numeric) - Production cost per arroba
      - `classification` (text) - Cost classification (excelente, media, alto_custo)
      
  2. Security
    - Enable RLS on `production_cost_calculations` table
    - Add policies for authenticated users to manage their own calculations
    
  3. Important Notes
    - All monetary values use numeric type
    - GMD (Ganho Médio Diário) must be positive
    - Classification helps identify cost efficiency
*/

CREATE TABLE IF NOT EXISTS production_cost_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  title text NOT NULL DEFAULT '',
  
  quantity_animals integer NOT NULL CHECK (quantity_animals > 0),
  lease_monthly numeric NOT NULL CHECK (lease_monthly >= 0),
  supplementation_monthly numeric NOT NULL CHECK (supplementation_monthly >= 0),
  labor_monthly numeric NOT NULL CHECK (labor_monthly >= 0),
  variable_costs_monthly numeric NOT NULL CHECK (variable_costs_monthly >= 0),
  gmd_kg numeric NOT NULL CHECK (gmd_kg > 0),
  
  total_monthly_expense numeric NOT NULL DEFAULT 0 CHECK (total_monthly_expense >= 0),
  monthly_expense_per_animal numeric NOT NULL DEFAULT 0 CHECK (monthly_expense_per_animal >= 0),
  daily_cost_per_animal numeric NOT NULL DEFAULT 0 CHECK (daily_cost_per_animal >= 0),
  days_per_arroba numeric NOT NULL DEFAULT 0 CHECK (days_per_arroba >= 0),
  cost_per_arroba numeric NOT NULL DEFAULT 0 CHECK (cost_per_arroba >= 0),
  classification text NOT NULL CHECK (classification IN ('excelente', 'media', 'alto_custo'))
);

ALTER TABLE production_cost_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own production cost calculations"
  ON production_cost_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own production cost calculations"
  ON production_cost_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own production cost calculations"
  ON production_cost_calculations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own production cost calculations"
  ON production_cost_calculations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_production_cost_calculations_user_id 
  ON production_cost_calculations(user_id);

CREATE INDEX IF NOT EXISTS idx_production_cost_calculations_created_at 
  ON production_cost_calculations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_production_cost_calculations_classification 
  ON production_cost_calculations(classification);

CREATE TRIGGER update_production_cost_calculations_updated_at
  BEFORE UPDATE ON production_cost_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
