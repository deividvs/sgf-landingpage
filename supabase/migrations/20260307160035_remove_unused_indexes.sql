/*
  # Remove Unused Indexes

  1. Cleanup
    - Remove all unused indexes that are not being used by queries
    - This reduces storage overhead and improves write performance
    - Indexes can be recreated later if needed based on actual usage patterns

  2. Indexes Removed
    - Various user_id indexes on simulation tables
    - Created_at and last_accessed_at indexes
    - Foreign key indexes that are not being used
    - Status and favorite indexes
*/

-- Remove unused indexes from supplementation_calculations
DROP INDEX IF EXISTS idx_supplementation_calculations_user_id;

-- Remove unused indexes from simulations
DROP INDEX IF EXISTS simulations_user_id_idx;

-- Remove unused indexes from supplementation_simulations
DROP INDEX IF EXISTS idx_supplementation_simulations_user_id;

-- Remove unused indexes from daily_cost_simulations
DROP INDEX IF EXISTS idx_daily_cost_simulations_user_id;

-- Remove unused indexes from premium_simulations
DROP INDEX IF EXISTS idx_premium_simulations_user_id;

-- Remove unused indexes from production_cost_calculations
DROP INDEX IF EXISTS idx_production_cost_calculations_user_id;

-- Remove unused indexes from stocking_rate_simulations
DROP INDEX IF EXISTS idx_stocking_rate_simulations_user_id;

-- Remove unused indexes from carcass_yield_calculations
DROP INDEX IF EXISTS idx_carcass_yield_calculations_user_id;
DROP INDEX IF EXISTS idx_carcass_yield_calculations_created_at;

-- Remove unused indexes from hotmart_purchases
DROP INDEX IF EXISTS idx_hotmart_purchases_buyer_email;
DROP INDEX IF EXISTS idx_hotmart_purchases_transaction_id;
DROP INDEX IF EXISTS idx_hotmart_purchases_status;

-- Remove unused indexes from annual_results
DROP INDEX IF EXISTS idx_annual_results_user_id;

-- Remove unused indexes from user_subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS idx_user_subscriptions_status;
DROP INDEX IF EXISTS idx_user_subscriptions_hotmart_transaction;

-- Remove unused indexes from purchase_simulations
DROP INDEX IF EXISTS idx_purchase_simulations_created_at;
DROP INDEX IF EXISTS idx_purchase_simulations_last_accessed_at;
DROP INDEX IF EXISTS idx_purchase_simulations_is_favorite;
DROP INDEX IF EXISTS idx_purchase_simulations_user_favorite;

-- Remove unused indexes from breakeven_simulations
DROP INDEX IF EXISTS idx_breakeven_simulations_user_id;
