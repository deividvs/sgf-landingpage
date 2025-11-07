/*
  # Update Premium Simulations Table - Add New Calculated Fields

  ## Overview
  This migration adds new calculated fields to the premium_simulations table
  to match the corrected calculation logic using 30kg per arroba instead of 15kg.

  ## Changes
  1. Add new columns:
     - `arrobas_at_purchase` (numeric) - Number of arrobas at purchase (weight/30)
     - `cost_per_kg` (numeric) - Cost per kilogram of live weight
     - `daily_premium_to_dilute` (numeric) - Daily premium amount to dilute

  ## Notes
  - All new fields are required for new records
  - Existing field `additional_weight_needed_kg` is being removed as it's no longer used
  - The new calculation uses 30kg per arroba as per Brazilian standards
*/

-- Add new calculated fields
DO $$
BEGIN
  -- Add arrobas_at_purchase field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'premium_simulations' 
    AND column_name = 'arrobas_at_purchase'
  ) THEN
    ALTER TABLE premium_simulations 
    ADD COLUMN arrobas_at_purchase numeric NOT NULL DEFAULT 0 CHECK (arrobas_at_purchase > 0);
  END IF;

  -- Add cost_per_kg field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'premium_simulations' 
    AND column_name = 'cost_per_kg'
  ) THEN
    ALTER TABLE premium_simulations 
    ADD COLUMN cost_per_kg numeric NOT NULL DEFAULT 0 CHECK (cost_per_kg > 0);
  END IF;

  -- Add daily_premium_to_dilute field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'premium_simulations' 
    AND column_name = 'daily_premium_to_dilute'
  ) THEN
    ALTER TABLE premium_simulations 
    ADD COLUMN daily_premium_to_dilute numeric NOT NULL DEFAULT 0 CHECK (daily_premium_to_dilute >= 0);
  END IF;
END $$;

-- Remove old field that is no longer used
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'premium_simulations' 
    AND column_name = 'additional_weight_needed_kg'
  ) THEN
    ALTER TABLE premium_simulations DROP COLUMN additional_weight_needed_kg;
  END IF;
END $$;
