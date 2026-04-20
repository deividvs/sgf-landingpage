/*
  # Add cost_per_kg to premium_simulations

  ## Changes
  - Adds the `cost_per_kg` column to the `premium_simulations` table

  ## Reason
  The PremiumCalculator component was trying to save `cost_per_kg` (custo por kg vivo do animal)
  but this column was missing from the table, causing the insert to fail with an unexpected error.

  ## New Columns
  - `cost_per_kg` (numeric, default 0): Cost per kg of live weight at the time of purchase
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'premium_simulations' AND column_name = 'cost_per_kg'
  ) THEN
    ALTER TABLE premium_simulations ADD COLUMN cost_per_kg numeric NOT NULL DEFAULT 0 CHECK (cost_per_kg >= 0);
  END IF;
END $$;
