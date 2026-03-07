/*
  # Fix RLS Security Issues

  1. Security Improvements
    - Remove duplicate SELECT policies on user_subscriptions
    - Replace "always true" policies with restrictive service_role-only access
    - Maintain proper separation between service role and authenticated users

  2. Changes
    - Remove "Service role can manage all subscriptions" policy (duplicate SELECT)
    - Replace "Service role can manage all purchases" with restrictive service_role policy
    - Replace "Service role can manage all subscriptions" with restrictive service_role policy

  3. Security Model
    - Authenticated users can only access their own data
    - Service role has full access (used by Edge Functions)
    - No bypass policies that are always true
*/

-- Remove the duplicate SELECT policy for user_subscriptions
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;

-- Create specific service role policies for user_subscriptions
CREATE POLICY "Service role can insert subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
  ON user_subscriptions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete subscriptions"
  ON user_subscriptions
  FOR DELETE
  TO service_role
  USING (true);

-- Replace the "always true" policy on hotmart_purchases with restrictive service_role policies
DROP POLICY IF EXISTS "Service role can manage all purchases" ON hotmart_purchases;

CREATE POLICY "Service role can view purchases"
  ON hotmart_purchases
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert purchases"
  ON hotmart_purchases
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update purchases"
  ON hotmart_purchases
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete purchases"
  ON hotmart_purchases
  FOR DELETE
  TO service_role
  USING (true);