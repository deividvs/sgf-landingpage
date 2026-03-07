/*
  # Add Carcass Calculation Fields to Annual Results

  1. Changes
    - Add `final_average_weight_kg` field for final live weight
    - Add `carcass_yield_percentage` field for carcass yield percentage
    - Add `arroba_price` field for arroba price
    - Add `carcass_weight_kg` calculated field for carcass weight
    - Add `arrobas_per_head` calculated field for arrobas per head
    - Add `total_arrobas` calculated field for total arrobas
    - Modify `total_revenue` to be calculated from arroba sales
    - Update table to support new revenue calculation method

  2. Important Notes
    - 1 arroba = 15kg of carcass weight
    - Revenue is now calculated as: total_arrobas × arroba_price
    - Carcass weight = live weight × carcass_yield_percentage
    - Arrobas per head = carcass_weight_kg ÷ 15
    - Total arrobas = arrobas_per_head × total_heads
*/

DO $$
BEGIN
  -- Add final_average_weight_kg if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'final_average_weight_kg'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN final_average_weight_kg numeric NOT NULL DEFAULT 0 CHECK (final_average_weight_kg >= 0);
  END IF;

  -- Add carcass_yield_percentage if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'carcass_yield_percentage'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN carcass_yield_percentage numeric NOT NULL DEFAULT 52 CHECK (carcass_yield_percentage >= 0 AND carcass_yield_percentage <= 100);
  END IF;

  -- Add arroba_price if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'arroba_price'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN arroba_price numeric NOT NULL DEFAULT 0 CHECK (arroba_price >= 0);
  END IF;

  -- Add carcass_weight_kg if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'carcass_weight_kg'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN carcass_weight_kg numeric NOT NULL DEFAULT 0 CHECK (carcass_weight_kg >= 0);
  END IF;

  -- Add arrobas_per_head if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'arrobas_per_head'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN arrobas_per_head numeric NOT NULL DEFAULT 0 CHECK (arrobas_per_head >= 0);
  END IF;

  -- Add total_arrobas if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'total_arrobas'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN total_arrobas numeric NOT NULL DEFAULT 0 CHECK (total_arrobas >= 0);
  END IF;
END $$;

-- Remove the NOT NULL constraint from total_revenue to allow calculated values
DO $$
BEGIN
  ALTER TABLE annual_results ALTER COLUMN total_revenue DROP NOT NULL;
  ALTER TABLE annual_results ALTER COLUMN total_revenue SET DEFAULT 0;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;