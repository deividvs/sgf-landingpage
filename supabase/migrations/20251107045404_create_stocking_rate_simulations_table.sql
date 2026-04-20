/*
  # Create Stocking Rate Simulations Table

  ## Overview
  This migration creates the table for storing stocking rate calculation simulations,
  which help users determine if their pasture area is underutilized, ideal, or overstocked.

  ## New Table

  ### `stocking_rate_simulations`
  Stores all stocking rate simulation data.

  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  #### Input Data
  - `area_ha` (numeric) - Size of the pasture area in hectares
  - `animal_quantity` (integer) - Number of animals in the area
  - `average_weight_kg` (numeric) - Average weight of animals in kg

  #### Calculated Results
  - `total_weight_kg` (numeric) - Total weight of the herd
  - `total_animal_units` (numeric) - Total animal units (UA) calculated as weight/450
  - `stocking_rate_ua_ha` (numeric) - Stocking rate in UA per hectare
  - `classification` (text) - Classification: underutilized, ideal, or overstocked

  ## Security
  - Enable RLS on the table
  - Users can only access their own simulations
  - Authenticated users can create, read, update, and delete their own simulations
*/

-- Create stocking_rate_simulations table
CREATE TABLE IF NOT EXISTS stocking_rate_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Input data
  area_ha numeric NOT NULL CHECK (area_ha > 0),
  animal_quantity integer NOT NULL CHECK (animal_quantity > 0),
  average_weight_kg numeric NOT NULL CHECK (average_weight_kg > 0),
  
  -- Calculated results
  total_weight_kg numeric NOT NULL CHECK (total_weight_kg >= 0),
  total_animal_units numeric NOT NULL CHECK (total_animal_units >= 0),
  stocking_rate_ua_ha numeric NOT NULL CHECK (stocking_rate_ua_ha >= 0),
  classification text NOT NULL CHECK (classification IN ('underutilized', 'ideal', 'overstocked'))
);

-- Enable RLS
ALTER TABLE stocking_rate_simulations ENABLE ROW LEVEL SECURITY;

-- Policies for stocking_rate_simulations table
CREATE POLICY "Users can view own stocking rate simulations"
  ON stocking_rate_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stocking rate simulations"
  ON stocking_rate_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stocking rate simulations"
  ON stocking_rate_simulations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stocking rate simulations"
  ON stocking_rate_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS stocking_rate_simulations_user_id_idx ON stocking_rate_simulations(user_id);
CREATE INDEX IF NOT EXISTS stocking_rate_simulations_created_at_idx ON stocking_rate_simulations(created_at DESC);
CREATE INDEX IF NOT EXISTS stocking_rate_simulations_classification_idx ON stocking_rate_simulations(classification);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_stocking_rate_simulations_updated_at
  BEFORE UPDATE ON stocking_rate_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
