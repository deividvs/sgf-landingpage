/*
  # Create Daily Cost Simulations Table

  ## Overview
  This migration creates the table for storing daily cost calculation simulations,
  which help users understand their operational costs per animal and profit margins per arroba.

  ## New Table

  ### `daily_cost_simulations`
  Stores all daily cost simulation data.

  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  #### Period Information
  - `month` (text) - Month name (Janeiro, Fevereiro, etc.)
  - `year` (integer) - Year of the simulation

  #### Input Data
  - `costs` (jsonb) - All monthly costs by category
  - `total_animals` (integer) - Average number of animals
  - `supplement_cost_per_kg` (numeric) - Cost per kg of supplement
  - `supplement_quantity_per_animal_day` (numeric) - Daily supplement quantity per animal
  - `average_daily_gain_kg` (numeric) - Average daily gain in kg (GMD)
  - `market_arroba_price` (numeric) - Current market price per arroba

  #### Calculated Results
  - `total_monthly_cost` (numeric) - Sum of all monthly costs
  - `total_daily_cost` (numeric) - Daily cost per animal
  - `days_to_produce_arroba` (numeric) - Days needed to produce one arroba
  - `cost_per_arroba` (numeric) - Production cost per arroba
  - `profit_per_arroba` (numeric) - Profit or loss per arroba
  - `is_profitable` (boolean) - Whether the operation is profitable

  ## Security
  - Enable RLS on the table
  - Users can only access their own simulations
  - Authenticated users can create, read, update, and delete their own simulations
*/

-- Create daily_cost_simulations table
CREATE TABLE IF NOT EXISTS daily_cost_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Period information
  month text NOT NULL,
  year integer NOT NULL CHECK (year >= 2000 AND year <= 2100),
  
  -- Input data
  costs jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_animals integer NOT NULL CHECK (total_animals > 0),
  supplement_cost_per_kg numeric NOT NULL CHECK (supplement_cost_per_kg >= 0),
  supplement_quantity_per_animal_day numeric NOT NULL CHECK (supplement_quantity_per_animal_day >= 0),
  average_daily_gain_kg numeric NOT NULL CHECK (average_daily_gain_kg > 0),
  market_arroba_price numeric NOT NULL CHECK (market_arroba_price > 0),
  
  -- Calculated results
  total_monthly_cost numeric NOT NULL CHECK (total_monthly_cost >= 0),
  total_daily_cost numeric NOT NULL CHECK (total_daily_cost >= 0),
  days_to_produce_arroba numeric NOT NULL CHECK (days_to_produce_arroba > 0),
  cost_per_arroba numeric NOT NULL CHECK (cost_per_arroba >= 0),
  profit_per_arroba numeric NOT NULL,
  is_profitable boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE daily_cost_simulations ENABLE ROW LEVEL SECURITY;

-- Policies for daily_cost_simulations table
CREATE POLICY "Users can view own daily cost simulations"
  ON daily_cost_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily cost simulations"
  ON daily_cost_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily cost simulations"
  ON daily_cost_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily cost simulations"
  ON daily_cost_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS daily_cost_simulations_user_id_idx ON daily_cost_simulations(user_id);
CREATE INDEX IF NOT EXISTS daily_cost_simulations_created_at_idx ON daily_cost_simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS daily_cost_simulations_year_month_idx ON daily_cost_simulations(year DESC, month);
CREATE INDEX IF NOT EXISTS daily_cost_simulations_is_profitable_idx ON daily_cost_simulations(is_profitable);

-- Create updated_at trigger
CREATE TRIGGER update_daily_cost_simulations_updated_at
  BEFORE UPDATE ON daily_cost_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();