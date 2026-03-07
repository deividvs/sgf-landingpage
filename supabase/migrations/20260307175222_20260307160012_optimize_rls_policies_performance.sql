/*
  # Optimize RLS Policies Performance

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Tables Updated
    - user_subscriptions
    - purchase_simulations
    - carcass_yield_calculations
    - user_tool_favorites

  3. Security
    - Maintains same security level
    - Only improves performance without changing access control
*/

-- Drop and recreate user_subscriptions policies with optimized auth calls
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate purchase_simulations policies
DROP POLICY IF EXISTS "Users can view own purchase simulations" ON purchase_simulations;
CREATE POLICY "Users can view own purchase simulations"
  ON purchase_simulations
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own purchase simulations" ON purchase_simulations;
CREATE POLICY "Users can insert own purchase simulations"
  ON purchase_simulations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own purchase simulations" ON purchase_simulations;
CREATE POLICY "Users can update own purchase simulations"
  ON purchase_simulations
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own purchase simulations" ON purchase_simulations;
CREATE POLICY "Users can delete own purchase simulations"
  ON purchase_simulations
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate carcass_yield_calculations policies
DROP POLICY IF EXISTS "Users can view own carcass yield calculations" ON carcass_yield_calculations;
CREATE POLICY "Users can view own carcass yield calculations"
  ON carcass_yield_calculations
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own carcass yield calculations" ON carcass_yield_calculations;
CREATE POLICY "Users can insert own carcass yield calculations"
  ON carcass_yield_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own carcass yield calculations" ON carcass_yield_calculations;
CREATE POLICY "Users can update own carcass yield calculations"
  ON carcass_yield_calculations
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own carcass yield calculations" ON carcass_yield_calculations;
CREATE POLICY "Users can delete own carcass yield calculations"
  ON carcass_yield_calculations
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate user_tool_favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON user_tool_favorites;
CREATE POLICY "Users can view own favorites"
  ON user_tool_favorites
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own favorites" ON user_tool_favorites;
CREATE POLICY "Users can insert own favorites"
  ON user_tool_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own favorites" ON user_tool_favorites;
CREATE POLICY "Users can delete own favorites"
  ON user_tool_favorites
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));