/*
  # Add Carcass Yield to Production Cost Calculations

  1. Changes
    - Add `carcass_yield_percentage` column to `production_cost_calculations` table
    - Default value of 52% (typical carcass yield)
  
  2. Notes
    - This field is used to calculate the correct number of days to produce 1 arroba
    - 1 arroba = 15kg of carcass (not live weight)
    - With carcass yield, we can accurately calculate: kg_live_weight_per_arroba = 15 / (yield / 100)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'production_cost_calculations' AND column_name = 'carcass_yield_percentage'
  ) THEN
    ALTER TABLE production_cost_calculations 
    ADD COLUMN carcass_yield_percentage decimal(5,2) DEFAULT 52.0 NOT NULL;
  END IF;
END $$;
