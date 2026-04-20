/*
  # Add Indexes for Foreign Keys

  1. Performance Optimization
    - Add covering indexes for all user_id foreign keys
    - Improves JOIN and WHERE clause performance
    - Essential for queries filtering by user_id

  2. Tables Affected
    - daily_cost_simulations
    - premium_simulations
    - production_cost_calculations
    - stocking_rate_simulations
    - supplementation_simulations

  3. Index Strategy
    - Create indexes on user_id columns
    - These support foreign key constraints and common query patterns
    - Improves RLS policy evaluation performance
*/

-- Create index for daily_cost_simulations.user_id
CREATE INDEX IF NOT EXISTS idx_daily_cost_simulations_user_id 
  ON daily_cost_simulations(user_id);

-- Create index for premium_simulations.user_id
CREATE INDEX IF NOT EXISTS idx_premium_simulations_user_id 
  ON premium_simulations(user_id);

-- Create index for production_cost_calculations.user_id
CREATE INDEX IF NOT EXISTS idx_production_cost_calculations_user_id 
  ON production_cost_calculations(user_id);

-- Create index for stocking_rate_simulations.user_id
CREATE INDEX IF NOT EXISTS idx_stocking_rate_simulations_user_id 
  ON stocking_rate_simulations(user_id);

-- Create index for supplementation_simulations.user_id
CREATE INDEX IF NOT EXISTS idx_supplementation_simulations_user_id 
  ON supplementation_simulations(user_id);
