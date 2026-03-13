/*
  # Fix Multiple Permissive Policies and Always-True Service Role Policies

  ## Summary
  1. Removes the duplicate permissive SELECT policy on user_subscriptions for authenticated users.
     The "Service role can manage all subscriptions" policy was triggering warnings because it
     used USING (true) / WITH CHECK (true). Replaced with a proper service_role-scoped policy.
  2. Similarly fixes hotmart_purchases service role policy.
  3. Adds RLS policy to the usuarios table which had RLS enabled but no policies.
     The usuarios table uses user_id (text) column to link to auth users.

  ## Changes
  - user_subscriptions: Remove always-true ALL policy, replace with targeted service_role policies
  - hotmart_purchases: Remove always-true ALL policy, replace with targeted service_role policies
  - usuarios: Add policies so authenticated users can access their own data
*/

-- Fix user_subscriptions: remove always-true service role policy
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

CREATE POLICY "Service role can insert subscriptions"
  ON public.user_subscriptions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
  ON public.user_subscriptions FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete subscriptions"
  ON public.user_subscriptions FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Service role can select subscriptions"
  ON public.user_subscriptions FOR SELECT
  TO service_role
  USING (true);

-- Fix hotmart_purchases: remove always-true service role policy
DROP POLICY IF EXISTS "Service role can manage all purchases" ON public.hotmart_purchases;

CREATE POLICY "Service role can insert purchases"
  ON public.hotmart_purchases FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update purchases"
  ON public.hotmart_purchases FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete purchases"
  ON public.hotmart_purchases FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Service role can select purchases"
  ON public.hotmart_purchases FOR SELECT
  TO service_role
  USING (true);

-- Add RLS policies for usuarios table (uses user_id text column)
CREATE POLICY "Users can view own usuario record"
  ON public.usuarios FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own usuario record"
  ON public.usuarios FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own usuario record"
  ON public.usuarios FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);
