/*
  # Remove Unused Indexes

  ## Summary
  Drops all indexes identified as unused to reduce storage overhead and improve
  write performance. These indexes were never used in query execution plans.

  ## Indexes Removed
  - simulations_user_id_idx
  - idx_hotmart_purchases_buyer_email, idx_hotmart_purchases_transaction_id, idx_hotmart_purchases_status
  - idx_annual_results_year, idx_annual_results_created_at
  - idx_user_subscriptions_user_id, idx_user_subscriptions_status, idx_user_subscriptions_hotmart_transaction
  - premium_simulations_created_at_idx
  - stocking_rate_simulations_created_at_idx, stocking_rate_simulations_classification_idx
  - daily_cost_simulations_created_at_idx, daily_cost_simulations_year_month_idx, daily_cost_simulations_is_profitable_idx
  - idx_supplementation_calculations_created_at, idx_supplementation_calculations_type
  - idx_breakeven_simulations_created_at, idx_breakeven_simulations_status
  - idx_purchase_simulations_created_at, idx_purchase_simulations_last_accessed
  - idx_carcass_yield_calculations_created_at
  - idx_production_cost_calculations_created_at, idx_production_cost_calculations_classification
*/

DROP INDEX IF EXISTS public.simulations_user_id_idx;
DROP INDEX IF EXISTS public.idx_hotmart_purchases_buyer_email;
DROP INDEX IF EXISTS public.idx_hotmart_purchases_transaction_id;
DROP INDEX IF EXISTS public.idx_hotmart_purchases_status;
DROP INDEX IF EXISTS public.idx_annual_results_year;
DROP INDEX IF EXISTS public.idx_annual_results_created_at;
DROP INDEX IF EXISTS public.idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_user_subscriptions_status;
DROP INDEX IF EXISTS public.idx_user_subscriptions_hotmart_transaction;
DROP INDEX IF EXISTS public.premium_simulations_created_at_idx;
DROP INDEX IF EXISTS public.stocking_rate_simulations_created_at_idx;
DROP INDEX IF EXISTS public.stocking_rate_simulations_classification_idx;
DROP INDEX IF EXISTS public.daily_cost_simulations_created_at_idx;
DROP INDEX IF EXISTS public.daily_cost_simulations_year_month_idx;
DROP INDEX IF EXISTS public.daily_cost_simulations_is_profitable_idx;
DROP INDEX IF EXISTS public.idx_supplementation_calculations_created_at;
DROP INDEX IF EXISTS public.idx_supplementation_calculations_type;
DROP INDEX IF EXISTS public.idx_breakeven_simulations_created_at;
DROP INDEX IF EXISTS public.idx_breakeven_simulations_status;
DROP INDEX IF EXISTS public.idx_purchase_simulations_created_at;
DROP INDEX IF EXISTS public.idx_purchase_simulations_last_accessed;
DROP INDEX IF EXISTS public.idx_carcass_yield_calculations_created_at;
DROP INDEX IF EXISTS public.idx_production_cost_calculations_created_at;
DROP INDEX IF EXISTS public.idx_production_cost_calculations_classification;
