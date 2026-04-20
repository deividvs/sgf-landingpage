/*
  # Create Premium Simulations Table

  ## Overview
  This migration creates the table for storing "Diluir Ágio" (Premium/Discount) simulations,
  which help users understand the financial impact of paying above or below market price
  for livestock purchases.

  ## New Table

  ### `premium_simulations`
  Stores all premium/discount simulation data.

  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  #### Input Data
  - `current_arroba_value` (numeric) - Current market price per arroba (R$/@)
  - `animal_paid_value` (numeric) - Total price paid for the animal (R$)
  - `purchase_weight_kg` (numeric) - Animal weight at purchase (kg)
  - `rearing_period_days` (integer) - Expected rearing period (days)

  #### Calculated Results
  - `paid_price_per_arroba` (numeric) - Actual price paid per arroba (R$/@)
  - `premium_discount_per_arroba` (numeric) - Premium/discount per arroba (R$/@)
  - `premium_discount_percentage` (numeric) - Premium/discount percentage (%)
  - `total_premium_discount_per_animal` (numeric) - Total premium/discount per animal (R$)
  - `additional_weight_needed_kg` (numeric) - Additional weight needed to dilute premium (kg)
  - `daily_gain_needed_kg` (numeric) - Daily weight gain needed (kg/day)
  - `situation` (text) - Situation: 'premium', 'discount', or 'neutral'

  ## Security
  - Enable RLS on the table
  - Users can only access their own simulations
  - Authenticated users can create, read, update, and delete their own simulations
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create premium_simulations table
CREATE TABLE IF NOT EXISTS premium_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Input data
  current_arroba_value numeric NOT NULL CHECK (current_arroba_value > 0),
  animal_paid_value numeric NOT NULL CHECK (animal_paid_value > 0),
  purchase_weight_kg numeric NOT NULL CHECK (purchase_weight_kg > 0),
  rearing_period_days integer NOT NULL CHECK (rearing_period_days > 0),
  
  -- Calculated results
  paid_price_per_arroba numeric NOT NULL CHECK (paid_price_per_arroba > 0),
  premium_discount_per_arroba numeric NOT NULL,
  premium_discount_percentage numeric NOT NULL,
  total_premium_discount_per_animal numeric NOT NULL,
  additional_weight_needed_kg numeric NOT NULL CHECK (additional_weight_needed_kg >= 0),
  daily_gain_needed_kg numeric NOT NULL CHECK (daily_gain_needed_kg >= 0),
  situation text NOT NULL CHECK (situation IN ('premium', 'discount', 'neutral'))
);

-- Enable RLS
ALTER TABLE premium_simulations ENABLE ROW LEVEL SECURITY;

-- Policies for premium_simulations table
CREATE POLICY "Users can view own premium simulations"
  ON premium_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own premium simulations"
  ON premium_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own premium simulations"
  ON premium_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own premium simulations"
  ON premium_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS premium_simulations_user_id_idx ON premium_simulations(user_id);
CREATE INDEX IF NOT EXISTS premium_simulations_created_at_idx ON premium_simulations(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_premium_simulations_updated_at
  BEFORE UPDATE ON premium_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
