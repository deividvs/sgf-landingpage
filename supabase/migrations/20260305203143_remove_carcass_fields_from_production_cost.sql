/*
  # Remove carcass yield fields from production_cost_calculations table

  1. Changes
    - Remove `carcass_yield_percentage` column
    - Remove `final_weight_kg` column
    - Remove `arroba_price` column
    - Remove `carcass_weight_kg` column
    - Remove `total_arrobas` column
    - Remove `total_revenue` column

  2. Notes
    - These fields are now handled by the dedicated carcass_yield_calculations table
    - This simplifies the production cost calculator to focus only on cost per arroba
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'carcass_yield_percentage'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN carcass_yield_percentage;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'final_weight_kg'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN final_weight_kg;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'arroba_price'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN arroba_price;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'carcass_weight_kg'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN carcass_weight_kg;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'total_arrobas'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN total_arrobas;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'total_revenue'
  ) THEN
    ALTER TABLE production_cost_calculations DROP COLUMN total_revenue;
  END IF;
END $$;