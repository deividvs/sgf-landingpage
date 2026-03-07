/*
  # Remove Unused Indexes

  1. Performance Optimization
    - Remove indexes that are not being used by queries
    - Reduces storage overhead and improves write performance
    - Indexes can be recreated later if needed

  2. Indexes Removed
    - annual_results: idx_annual_results_year, idx_annual_results_created_at
    - breakeven_simulations: idx_breakeven_simulations_created_at, idx_breakeven_simulations_status
    - supplementation_calculations: idx_supplementation_calculations_created_at, idx_supplementation_calculations_type
    - production_cost_calculations: idx_production_cost_calculations_user_id, idx_production_cost_calculations_created_at, idx_production_cost_calculations_classification
    - simulations: simulations_created_at_idx
    - premium_simulations: premium_simulations_user_id_idx, premium_simulations_created_at_idx
    - supplementation_simulations: supplementation_simulations_user_id_idx, supplementation_simulations_created_at_idx
    - stocking_rate_simulations: stocking_rate_simulations_user_id_idx, stocking_rate_simulations_created_at_idx, stocking_rate_simulations_classification_idx
    - daily_cost_simulations: daily_cost_simulations_user_id_idx, daily_cost_simulations_created_at_idx, daily_cost_simulations_year_month_idx, daily_cost_simulations_is_profitable_idx
*/

-- Drop unused indexes on annual_results
DROP INDEX IF EXISTS idx_annual_results_year;
DROP INDEX IF EXISTS idx_annual_results_created_at;

-- Drop unused indexes on breakeven_simulations
DROP INDEX IF EXISTS idx_breakeven_simulations_created_at;
DROP INDEX IF EXISTS idx_breakeven_simulations_status;

-- Drop unused indexes on supplementation_calculations
DROP INDEX IF EXISTS idx_supplementation_calculations_created_at;
DROP INDEX IF EXISTS idx_supplementation_calculations_type;

-- Drop unused indexes on production_cost_calculations
DROP INDEX IF EXISTS idx_production_cost_calculations_user_id;
DROP INDEX IF EXISTS idx_production_cost_calculations_created_at;
DROP INDEX IF EXISTS idx_production_cost_calculations_classification;

-- Drop unused indexes on simulations
DROP INDEX IF EXISTS simulations_created_at_idx;

-- Drop unused indexes on premium_simulations
DROP INDEX IF EXISTS premium_simulations_user_id_idx;
DROP INDEX IF EXISTS premium_simulations_created_at_idx;

-- Drop unused indexes on supplementation_simulations
DROP INDEX IF EXISTS supplementation_simulations_user_id_idx;
DROP INDEX IF EXISTS supplementation_simulations_created_at_idx;

-- Drop unused indexes on stocking_rate_simulations
DROP INDEX IF EXISTS stocking_rate_simulations_user_id_idx;
DROP INDEX IF EXISTS stocking_rate_simulations_created_at_idx;
DROP INDEX IF EXISTS stocking_rate_simulations_classification_idx;

-- Drop unused indexes on daily_cost_simulations
DROP INDEX IF EXISTS daily_cost_simulations_user_id_idx;
DROP INDEX IF EXISTS daily_cost_simulations_created_at_idx;
DROP INDEX IF EXISTS daily_cost_simulations_year_month_idx;
DROP INDEX IF EXISTS daily_cost_simulations_is_profitable_idx;