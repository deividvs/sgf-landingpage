/*
  # Fix Function Search Path Security Issue

  1. Security Improvement
    - Set immutable search_path for update_updated_at_column function
    - Prevents search_path hijacking attacks
    - Ensures function always uses correct schema

  2. Changes
    - Drop existing function
    - Recreate with explicit search_path set to pg_catalog and public
    - Add SECURITY DEFINER with proper search_path
*/

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers for all tables that use this function
CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_simulations_updated_at
  BEFORE UPDATE ON premium_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplementation_simulations_updated_at
  BEFORE UPDATE ON supplementation_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stocking_rate_simulations_updated_at
  BEFORE UPDATE ON stocking_rate_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_cost_simulations_updated_at
  BEFORE UPDATE ON daily_cost_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_annual_results_updated_at
  BEFORE UPDATE ON annual_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breakeven_simulations_updated_at
  BEFORE UPDATE ON breakeven_simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplementation_calculations_updated_at
  BEFORE UPDATE ON supplementation_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_cost_calculations_updated_at
  BEFORE UPDATE ON production_cost_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
