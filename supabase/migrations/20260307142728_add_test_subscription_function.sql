/*
  # Add Test Subscription Function
  
  1. New Functions
    - `create_test_subscription(user_email)` - Creates a test subscription for development
    - Automatically creates an active subscription that never expires
    
  2. Purpose
    - Allow developers to easily test the application
    - Provide a way to activate subscriptions manually
    - Support development and testing without real Hotmart integration
    
  3. Security
    - Function can only be called by authenticated users
    - Can be restricted to specific roles in production
    
  4. Usage
    - Call `SELECT create_test_subscription('user@example.com')` to activate a user
    - Or use the function from the application to grant test access
*/

-- Create function to add test subscription
CREATE OR REPLACE FUNCTION create_test_subscription(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert or update subscription
  INSERT INTO user_subscriptions (
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
    NULL  -- NULL means never expires
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    subscription_status = 'active',
    expires_at = NULL,
    updated_at = now();
END;
$$;

-- Grant execute permission to authenticated users (can be restricted later)
GRANT EXECUTE ON FUNCTION create_test_subscription(TEXT) TO authenticated;
