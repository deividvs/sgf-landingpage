/*
  # Fix RLS Policies Performance Issues

  1. Security Improvements
    - Replace all `auth.uid()` with `(select auth.uid())` in RLS policies
    - This prevents re-evaluation of auth function for each row
    - Significantly improves query performance at scale

  2. Tables Affected
    - simulations
    - premium_simulations
    - supplementation_simulations
    - stocking_rate_simulations
    - daily_cost_simulations
    - annual_results
    - breakeven_simulations
    - supplementation_calculations
    - production_cost_calculations

  3. Changes
    - Drop existing RLS policies
    - Recreate with optimized `(select auth.uid())` pattern
*/

-- Fix simulations table policies
DROP POLICY IF EXISTS "Users can view own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can insert own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can update own simulations" ON simulations;
DROP POLICY IF EXISTS "Users can delete own simulations" ON simulations;

CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own simulations"
  ON simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own simulations"
  ON simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix premium_simulations table policies
DROP POLICY IF EXISTS "Users can view own premium simulations" ON premium_simulations;
DROP POLICY IF EXISTS "Users can insert own premium simulations" ON premium_simulations;
DROP POLICY IF EXISTS "Users can update own premium simulations" ON premium_simulations;
DROP POLICY IF EXISTS "Users can delete own premium simulations" ON premium_simulations;

CREATE POLICY "Users can view own premium simulations"
  ON premium_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own premium simulations"
  ON premium_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own premium simulations"
  ON premium_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own premium simulations"
  ON premium_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix supplementation_simulations table policies
DROP POLICY IF EXISTS "Users can view own supplementation simulations" ON supplementation_simulations;
DROP POLICY IF EXISTS "Users can insert own supplementation simulations" ON supplementation_simulations;
DROP POLICY IF EXISTS "Users can update own supplementation simulations" ON supplementation_simulations;
DROP POLICY IF EXISTS "Users can delete own supplementation simulations" ON supplementation_simulations;

CREATE POLICY "Users can view own supplementation simulations"
  ON supplementation_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own supplementation simulations"
  ON supplementation_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own supplementation simulations"
  ON supplementation_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own supplementation simulations"
  ON supplementation_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix stocking_rate_simulations table policies
DROP POLICY IF EXISTS "Users can view own stocking rate simulations" ON stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can insert own stocking rate simulations" ON stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can update own stocking rate simulations" ON stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can delete own stocking rate simulations" ON stocking_rate_simulations;

CREATE POLICY "Users can view own stocking rate simulations"
  ON stocking_rate_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own stocking rate simulations"
  ON stocking_rate_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own stocking rate simulations"
  ON stocking_rate_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own stocking rate simulations"
  ON stocking_rate_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix daily_cost_simulations table policies
DROP POLICY IF EXISTS "Users can view own daily cost simulations" ON daily_cost_simulations;
DROP POLICY IF EXISTS "Users can insert own daily cost simulations" ON daily_cost_simulations;
DROP POLICY IF EXISTS "Users can update own daily cost simulations" ON daily_cost_simulations;
DROP POLICY IF EXISTS "Users can delete own daily cost simulations" ON daily_cost_simulations;

CREATE POLICY "Users can view own daily cost simulations"
  ON daily_cost_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own daily cost simulations"
  ON daily_cost_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own daily cost simulations"
  ON daily_cost_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own daily cost simulations"
  ON daily_cost_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix annual_results table policies
DROP POLICY IF EXISTS "Users can view own annual results" ON annual_results;
DROP POLICY IF EXISTS "Users can insert own annual results" ON annual_results;
DROP POLICY IF EXISTS "Users can update own annual results" ON annual_results;
DROP POLICY IF EXISTS "Users can delete own annual results" ON annual_results;

CREATE POLICY "Users can view own annual results"
  ON annual_results FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own annual results"
  ON annual_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own annual results"
  ON annual_results FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own annual results"
  ON annual_results FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix breakeven_simulations table policies
DROP POLICY IF EXISTS "Users can view own breakeven simulations" ON breakeven_simulations;
DROP POLICY IF EXISTS "Users can insert own breakeven simulations" ON breakeven_simulations;
DROP POLICY IF EXISTS "Users can update own breakeven simulations" ON breakeven_simulations;
DROP POLICY IF EXISTS "Users can delete own breakeven simulations" ON breakeven_simulations;

CREATE POLICY "Users can view own breakeven simulations"
  ON breakeven_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own breakeven simulations"
  ON breakeven_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own breakeven simulations"
  ON breakeven_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own breakeven simulations"
  ON breakeven_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix supplementation_calculations table policies
DROP POLICY IF EXISTS "Users can view own supplementation calculations" ON supplementation_calculations;
DROP POLICY IF EXISTS "Users can insert own supplementation calculations" ON supplementation_calculations;
DROP POLICY IF EXISTS "Users can update own supplementation calculations" ON supplementation_calculations;
DROP POLICY IF EXISTS "Users can delete own supplementation calculations" ON supplementation_calculations;

CREATE POLICY "Users can view own supplementation calculations"
  ON supplementation_calculations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own supplementation calculations"
  ON supplementation_calculations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own supplementation calculations"
  ON supplementation_calculations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own supplementation calculations"
  ON supplementation_calculations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix production_cost_calculations table policies
DROP POLICY IF EXISTS "Users can view own production cost calculations" ON production_cost_calculations;
DROP POLICY IF EXISTS "Users can insert own production cost calculations" ON production_cost_calculations;
DROP POLICY IF EXISTS "Users can update own production cost calculations" ON production_cost_calculations;
DROP POLICY IF EXISTS "Users can delete own production cost calculations" ON production_cost_calculations;

CREATE POLICY "Users can view own production cost calculations"
  ON production_cost_calculations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own production cost calculations"
  ON production_cost_calculations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own production cost calculations"
  ON production_cost_calculations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own production cost calculations"
  ON production_cost_calculations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
