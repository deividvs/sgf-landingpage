/*
  # Create Initial Schema for Pecuária Simulador Pro

  ## Overview
  This migration creates the initial database schema for the livestock simulation system.

  ## New Tables
  
  ### `simulations`
  Stores all simulation data with inputs and calculated results.
  
  - `id` (uuid, primary key) - Unique identifier for each simulation
  - `user_id` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Timestamp of simulation creation
  - `updated_at` (timestamptz) - Timestamp of last update
  - `title` (text) - Description/title of the simulation
  
  #### Livestock Data
  - `herd_description` (text) - Description of the herd
  - `quantity` (integer) - Number of animals
  - `initial_weight` (numeric) - Initial weight per head in kg
  - `final_weight` (numeric) - Target final weight per head in kg
  - `acquisition_value_per_kg` (numeric) - Purchase price per kg of live weight
  - `average_daily_gain` (numeric) - GMD (Ganho Médio Diário)
  
  #### Cost Data
  - `lease_monthly_per_head` (numeric) - Monthly lease cost per animal
  - `workers_count` (integer) - Number of workers
  - `labor_monthly_total` (numeric) - Total monthly labor cost including benefits
  - `supplement_bag_price` (numeric) - Price per bag of supplement
  - `supplement_bag_weight` (numeric) - Weight of supplement bag in kg
  - `supplement_percentage` (numeric) - Percentage of body weight to feed
  - `supplement_daily_consumption` (numeric) - Daily consumption in kg
  - `other_expenses_monthly_per_head` (numeric) - Other monthly expenses per head
  - `arroba_value` (numeric) - Current value per arroba (15kg)
  
  #### Calculated Results (stored for historical purposes)
  - `weight_to_gain` (numeric) - Total weight to gain
  - `months_to_sell` (numeric) - Number of months until sale
  - `total_revenue` (numeric) - Total revenue from sale
  - `total_expenses` (numeric) - Total expenses
  - `profit_margin_percentage` (numeric) - Profit margin percentage
  - `result_per_animal` (numeric) - Profit per animal
  - `cost_per_arroba` (numeric) - Production cost per arroba
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own simulations
  - Authenticated users can create, read, update, and delete their own simulations
*/

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  title text NOT NULL,
  
  -- Herd information
  herd_description text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  initial_weight numeric NOT NULL CHECK (initial_weight > 0),
  final_weight numeric NOT NULL CHECK (final_weight > initial_weight),
  acquisition_value_per_kg numeric NOT NULL CHECK (acquisition_value_per_kg > 0),
  average_daily_gain numeric NOT NULL CHECK (average_daily_gain > 0),
  
  -- Costs
  lease_monthly_per_head numeric NOT NULL DEFAULT 0 CHECK (lease_monthly_per_head >= 0),
  workers_count integer NOT NULL DEFAULT 0 CHECK (workers_count >= 0),
  labor_monthly_total numeric NOT NULL DEFAULT 0 CHECK (labor_monthly_total >= 0),
  supplement_bag_price numeric NOT NULL DEFAULT 0 CHECK (supplement_bag_price >= 0),
  supplement_bag_weight numeric NOT NULL DEFAULT 30 CHECK (supplement_bag_weight > 0),
  supplement_percentage numeric NOT NULL DEFAULT 0 CHECK (supplement_percentage >= 0),
  supplement_daily_consumption numeric NOT NULL DEFAULT 0 CHECK (supplement_daily_consumption >= 0),
  other_expenses_monthly_per_head numeric NOT NULL DEFAULT 0 CHECK (other_expenses_monthly_per_head >= 0),
  arroba_value numeric NOT NULL CHECK (arroba_value > 0),
  
  -- Calculated results
  weight_to_gain numeric NOT NULL,
  months_to_sell numeric NOT NULL,
  total_revenue numeric NOT NULL,
  total_expenses numeric NOT NULL,
  profit_margin_percentage numeric NOT NULL,
  result_per_animal numeric NOT NULL,
  cost_per_arroba numeric NOT NULL
);

-- Enable RLS
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Policies for simulations table
CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS simulations_user_id_idx ON simulations(user_id);
CREATE INDEX IF NOT EXISTS simulations_created_at_idx ON simulations(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();