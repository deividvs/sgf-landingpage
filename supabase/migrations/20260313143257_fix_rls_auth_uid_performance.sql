/*
  # Fix RLS auth.uid() Performance Issues

  ## Summary
  Replaces direct `auth.uid()` calls with `(select auth.uid())` in all RLS policies
  across all tables. This prevents re-evaluation of auth functions for each row,
  significantly improving query performance at scale.

  ## Tables Updated
  - public.simulations
  - public.user_subscriptions
  - public.annual_results
  - public.premium_simulations
  - public.stocking_rate_simulations
  - public.daily_cost_simulations
  - public.breakeven_simulations
  - public.supplementation_calculations
  - public.purchase_simulations
  - public.carcass_yield_calculations
  - public.production_cost_calculations
*/

-- simulations
DROP POLICY IF EXISTS "Users can view own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can insert own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can update own simulations" ON public.simulations;
DROP POLICY IF EXISTS "Users can delete own simulations" ON public.simulations;

CREATE POLICY "Users can view own simulations"
  ON public.simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own simulations"
  ON public.simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own simulations"
  ON public.simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own simulations"
  ON public.simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- annual_results
DROP POLICY IF EXISTS "Users can view own annual results" ON public.annual_results;
DROP POLICY IF EXISTS "Users can insert own annual results" ON public.annual_results;
DROP POLICY IF EXISTS "Users can update own annual results" ON public.annual_results;
DROP POLICY IF EXISTS "Users can delete own annual results" ON public.annual_results;

CREATE POLICY "Users can view own annual results"
  ON public.annual_results FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own annual results"
  ON public.annual_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own annual results"
  ON public.annual_results FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own annual results"
  ON public.annual_results FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- premium_simulations
DROP POLICY IF EXISTS "Users can view own premium simulations" ON public.premium_simulations;
DROP POLICY IF EXISTS "Users can insert own premium simulations" ON public.premium_simulations;
DROP POLICY IF EXISTS "Users can update own premium simulations" ON public.premium_simulations;
DROP POLICY IF EXISTS "Users can delete own premium simulations" ON public.premium_simulations;

CREATE POLICY "Users can view own premium simulations"
  ON public.premium_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own premium simulations"
  ON public.premium_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own premium simulations"
  ON public.premium_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own premium simulations"
  ON public.premium_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- stocking_rate_simulations
DROP POLICY IF EXISTS "Users can view own stocking rate simulations" ON public.stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can insert own stocking rate simulations" ON public.stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can update own stocking rate simulations" ON public.stocking_rate_simulations;
DROP POLICY IF EXISTS "Users can delete own stocking rate simulations" ON public.stocking_rate_simulations;

CREATE POLICY "Users can view own stocking rate simulations"
  ON public.stocking_rate_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own stocking rate simulations"
  ON public.stocking_rate_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own stocking rate simulations"
  ON public.stocking_rate_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own stocking rate simulations"
  ON public.stocking_rate_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- daily_cost_simulations
DROP POLICY IF EXISTS "Users can view own daily cost simulations" ON public.daily_cost_simulations;
DROP POLICY IF EXISTS "Users can insert own daily cost simulations" ON public.daily_cost_simulations;
DROP POLICY IF EXISTS "Users can update own daily cost simulations" ON public.daily_cost_simulations;
DROP POLICY IF EXISTS "Users can delete own daily cost simulations" ON public.daily_cost_simulations;

CREATE POLICY "Users can view own daily cost simulations"
  ON public.daily_cost_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own daily cost simulations"
  ON public.daily_cost_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own daily cost simulations"
  ON public.daily_cost_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own daily cost simulations"
  ON public.daily_cost_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- breakeven_simulations
DROP POLICY IF EXISTS "Users can view own breakeven simulations" ON public.breakeven_simulations;
DROP POLICY IF EXISTS "Users can insert own breakeven simulations" ON public.breakeven_simulations;
DROP POLICY IF EXISTS "Users can update own breakeven simulations" ON public.breakeven_simulations;
DROP POLICY IF EXISTS "Users can delete own breakeven simulations" ON public.breakeven_simulations;

CREATE POLICY "Users can view own breakeven simulations"
  ON public.breakeven_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own breakeven simulations"
  ON public.breakeven_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own breakeven simulations"
  ON public.breakeven_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own breakeven simulations"
  ON public.breakeven_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- supplementation_calculations
DROP POLICY IF EXISTS "Users can view own supplementation calculations" ON public.supplementation_calculations;
DROP POLICY IF EXISTS "Users can insert own supplementation calculations" ON public.supplementation_calculations;
DROP POLICY IF EXISTS "Users can update own supplementation calculations" ON public.supplementation_calculations;
DROP POLICY IF EXISTS "Users can delete own supplementation calculations" ON public.supplementation_calculations;

CREATE POLICY "Users can view own supplementation calculations"
  ON public.supplementation_calculations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own supplementation calculations"
  ON public.supplementation_calculations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own supplementation calculations"
  ON public.supplementation_calculations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own supplementation calculations"
  ON public.supplementation_calculations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- purchase_simulations
DROP POLICY IF EXISTS "Users can view own purchase simulations" ON public.purchase_simulations;
DROP POLICY IF EXISTS "Users can insert own purchase simulations" ON public.purchase_simulations;
DROP POLICY IF EXISTS "Users can update own purchase simulations" ON public.purchase_simulations;
DROP POLICY IF EXISTS "Users can delete own purchase simulations" ON public.purchase_simulations;

CREATE POLICY "Users can view own purchase simulations"
  ON public.purchase_simulations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own purchase simulations"
  ON public.purchase_simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own purchase simulations"
  ON public.purchase_simulations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own purchase simulations"
  ON public.purchase_simulations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- carcass_yield_calculations
DROP POLICY IF EXISTS "Users can view own carcass yield calculations" ON public.carcass_yield_calculations;
DROP POLICY IF EXISTS "Users can insert own carcass yield calculations" ON public.carcass_yield_calculations;
DROP POLICY IF EXISTS "Users can update own carcass yield calculations" ON public.carcass_yield_calculations;
DROP POLICY IF EXISTS "Users can delete own carcass yield calculations" ON public.carcass_yield_calculations;

CREATE POLICY "Users can view own carcass yield calculations"
  ON public.carcass_yield_calculations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own carcass yield calculations"
  ON public.carcass_yield_calculations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own carcass yield calculations"
  ON public.carcass_yield_calculations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own carcass yield calculations"
  ON public.carcass_yield_calculations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- production_cost_calculations
DROP POLICY IF EXISTS "Users can view own production cost calculations" ON public.production_cost_calculations;
DROP POLICY IF EXISTS "Users can insert own production cost calculations" ON public.production_cost_calculations;
DROP POLICY IF EXISTS "Users can update own production cost calculations" ON public.production_cost_calculations;
DROP POLICY IF EXISTS "Users can delete own production cost calculations" ON public.production_cost_calculations;

CREATE POLICY "Users can view own production cost calculations"
  ON public.production_cost_calculations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own production cost calculations"
  ON public.production_cost_calculations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own production cost calculations"
  ON public.production_cost_calculations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own production cost calculations"
  ON public.production_cost_calculations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
