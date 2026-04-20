/*
  # Fix Mutable search_path in Functions

  ## Summary
  Adds `SET search_path = ''` to all functions that have a mutable search_path.
  This prevents potential search_path injection attacks by fixing the search path
  at function definition time.

  ## Functions Fixed
  - public.create_test_subscription
  - public.update_updated_at_column
  - public.has_active_subscription
*/

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid uuid)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = user_uuid
    AND subscription_status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_test_subscription(user_email text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  INSERT INTO public.user_subscriptions (
    user_id,
    hotmart_transaction_id,
    subscription_status,
    started_at,
    expires_at
  ) VALUES (
    target_user_id,
    'TEST-' || gen_random_uuid()::text,
    'active',
    now(),
    NULL
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    subscription_status = 'active',
    expires_at = NULL,
    updated_at = now();
END;
$function$;
