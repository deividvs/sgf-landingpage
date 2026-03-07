/*
  # Add Individual Cost Fields to Simulations

  ## Changes
  This migration adds individual cost breakdown fields to the simulations table
  for better tracking and historical data accuracy.

  ## New Columns
  - `acquisition_costs` (numeric) - Total cost of animal acquisition
  - `lease_costs` (numeric) - Total lease costs for the period
  - `labor_costs` (numeric) - Total labor costs for the period
  - `supplement_costs` (numeric) - Total supplementation costs for the period
  - `other_costs` (numeric) - Total other expenses for the period

  ## Notes
  - All fields are nullable for backward compatibility with existing records
  - Default value is 0 for new records
*/

-- Add individual cost breakdown fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'acquisition_costs'
  ) THEN
    ALTER TABLE simulations 
    ADD COLUMN acquisition_costs numeric DEFAULT 0 CHECK (acquisition_costs >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'lease_costs'
  ) THEN
    ALTER TABLE simulations 
    ADD COLUMN lease_costs numeric DEFAULT 0 CHECK (lease_costs >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'labor_costs'
  ) THEN
    ALTER TABLE simulations 
    ADD COLUMN labor_costs numeric DEFAULT 0 CHECK (labor_costs >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'supplement_costs'
  ) THEN
    ALTER TABLE simulations 
    ADD COLUMN supplement_costs numeric DEFAULT 0 CHECK (supplement_costs >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'other_costs'
  ) THEN
    ALTER TABLE simulations 
    ADD COLUMN other_costs numeric DEFAULT 0 CHECK (other_costs >= 0);
  END IF;
END $$;