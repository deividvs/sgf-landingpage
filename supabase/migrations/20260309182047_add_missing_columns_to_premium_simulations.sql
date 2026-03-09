/*
  # Add missing columns to premium_simulations

  1. Changes
    - Add `arrobas_at_purchase` (numeric) - arrobas count at purchase
    - Add `daily_premium_to_dilute` (numeric) - daily premium/discount to dilute per day

  2. Notes
    - These columns exist in the application logic but were missing from the table schema
    - This caused all saves in the Premium (Diluir Ágio) calculator to fail with a column error
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'premium_simulations' AND column_name = 'arrobas_at_purchase'
  ) THEN
    ALTER TABLE premium_simulations ADD COLUMN arrobas_at_purchase numeric NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'premium_simulations' AND column_name = 'daily_premium_to_dilute'
  ) THEN
    ALTER TABLE premium_simulations ADD COLUMN daily_premium_to_dilute numeric NOT NULL DEFAULT 0;
  END IF;
END $$;
