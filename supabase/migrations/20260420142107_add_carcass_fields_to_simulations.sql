/*
  # Add carcass fields to simulations table

  ## Overview
  The simulations table was missing four fields that are required for the
  "Ver Detalhes" view to render correctly. Without these fields, the
  ResultsView component receives undefined values and crashes with a white screen.

  ## Changes

  ### Modified Table: `simulations`
  New columns added:
  - `carcass_yield_percentage` (numeric, default 52): Carcass yield percentage used in revenue calculation
  - `carcass_weight_kg` (numeric, default 0): Carcass weight per animal in kg
  - `arrobas_per_head` (numeric, default 0): Number of arrobas per animal
  - `total_arrobas` (numeric, default 0): Total arrobas for the entire herd

  ## Notes
  - All columns are nullable to maintain backwards compatibility with existing records
  - Default values are provided so existing rows do not violate constraints
  - carcass_yield_percentage defaults to 52, which is the standard bovine carcass yield
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'simulations' AND column_name = 'carcass_yield_percentage'
  ) THEN
    ALTER TABLE simulations ADD COLUMN carcass_yield_percentage numeric DEFAULT 52;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'simulations' AND column_name = 'carcass_weight_kg'
  ) THEN
    ALTER TABLE simulations ADD COLUMN carcass_weight_kg numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'simulations' AND column_name = 'arrobas_per_head'
  ) THEN
    ALTER TABLE simulations ADD COLUMN arrobas_per_head numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'simulations' AND column_name = 'total_arrobas'
  ) THEN
    ALTER TABLE simulations ADD COLUMN total_arrobas numeric DEFAULT 0;
  END IF;
END $$;
