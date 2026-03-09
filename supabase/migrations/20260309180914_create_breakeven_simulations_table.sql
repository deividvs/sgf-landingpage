/*
  # Create Breakeven Point Simulations Table

  1. New Tables
    - `breakeven_simulations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `title` (text) - Optional simulation title
      
      Input Fields:
      - `acquisition_value` (numeric) - Initial cost per animal
      - `daily_cost` (numeric) - Average daily cost per animal
      - `days_in_cycle` (integer) - Total days in the cycle
      - `final_weight_kg` (numeric) - Expected final weight in kg
      - `current_arroba_price` (numeric) - Current market price per arroba
      
      Calculated Results:
      - `total_revenue` (numeric) - Total revenue from sale
      - `total_expenses` (numeric) - Sum of all costs
      - `total_arrobas` (numeric) - Total arrobas produced (weight/30)
      - `breakeven_price` (numeric) - Minimum price per arroba to break even
      - `profit_per_arroba` (numeric) - Profit or loss per arroba
      - `final_result` (numeric) - Total profit or loss per animal
      - `status` (text) - 'profit', 'breakeven', or 'loss'
      
  2. Security
    - Enable RLS on `breakeven_simulations` table
    - Add policies for authenticated users to manage their own simulations
    
  3. Important Notes
    - All monetary values use numeric type with 2 decimal precision
    - Days must be positive integers
    - Weight and prices must be positive values
    - Status helps quickly identify profitable operations
*/

CREATE TABLE IF NOT EXISTS breakeven_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  title text NOT NULL DEFAULT '',
  
  acquisition_value numeric NOT NULL CHECK (acquisition_value >= 0),
  daily_cost numeric NOT NULL CHECK (daily_cost >= 0),
  days_in_cycle integer NOT NULL CHECK (days_in_cycle > 0),
  final_weight_kg numeric NOT NULL CHECK (final_weight_kg > 0),
  current_arroba_price numeric NOT NULL CHECK (current_arroba_price > 0),
  
  total_revenue numeric NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
  total_expenses numeric NOT NULL DEFAULT 0 CHECK (total_expenses >= 0),
  total_arrobas numeric NOT NULL DEFAULT 0 CHECK (total_arrobas >= 0),
  breakeven_price numeric NOT NULL DEFAULT 0 CHECK (breakeven_price >= 0),
  profit_per_arroba numeric NOT NULL DEFAULT 0,
  final_result numeric NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('profit', 'breakeven', 'loss'))
);

ALTER TABLE breakeven_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own breakeven simulations"
  ON breakeven_simulations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own breakeven simulations"
  ON breakeven_simulations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own breakeven simulations"
  ON breakeven_simulations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own breakeven simulations"
  ON breakeven_simulations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_breakeven_simulations_user_id ON breakeven_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_breakeven_simulations_created_at ON breakeven_simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_breakeven_simulations_status ON breakeven_simulations(status);

CREATE TRIGGER update_breakeven_simulations_updated_at
  BEFORE UPDATE ON breakeven_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
