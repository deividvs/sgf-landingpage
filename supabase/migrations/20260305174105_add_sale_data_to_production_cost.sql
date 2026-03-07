/*
  # Add Sale Data to Production Cost Calculations

  1. Changes
    - Add `final_weight_kg` column for the final live weight of the animal
    - Add `arroba_price` column for the price per arroba
    - Add `carcass_weight_kg` column for calculated carcass weight
    - Add `total_arrobas` column for calculated total arrobas
    - Add `total_revenue` column for calculated total revenue
  
  2. Notes
    - These fields are optional and allow calculating expected revenue
    - Formula: carcass_weight = final_weight × (carcass_yield / 100)
    - Formula: total_arrobas = carcass_weight / 15
    - Formula: total_revenue = total_arrobas × arroba_price
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'final_weight_kg'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN final_weight_kg decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'arroba_price'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN arroba_price decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'carcass_weight_kg'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN carcass_weight_kg decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'total_arrobas'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN total_arrobas decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'total_revenue'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN total_revenue decimal(12,2);
  END IF;
END $$;
