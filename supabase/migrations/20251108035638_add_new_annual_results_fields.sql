/*
  # Add New Fields to Annual Results Table

  1. New Columns
    - `profit_per_head` (numeric) - Profit per animal (Revenue - Cost - Expense per head)
    - `cost_percentage` (numeric) - Percentage of costs over total revenue
    - `expense_percentage` (numeric) - Percentage of expenses over total revenue
    - `profit_percentage` (numeric) - Percentage of profit over total revenue
    
  2. Important Notes
    - All new fields default to 0 for consistency
    - These fields enable detailed financial analysis
    - Percentages are stored as numeric values (e.g., 26.19 for 26.19%)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'profit_per_head'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN profit_per_head numeric NOT NULL DEFAULT 0 CHECK (profit_per_head >= -999999);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'cost_percentage'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN cost_percentage numeric NOT NULL DEFAULT 0 CHECK (cost_percentage >= 0 AND cost_percentage <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'expense_percentage'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN expense_percentage numeric NOT NULL DEFAULT 0 CHECK (expense_percentage >= 0 AND expense_percentage <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_results' AND column_name = 'profit_percentage'
  ) THEN
    ALTER TABLE annual_results ADD COLUMN profit_percentage numeric NOT NULL DEFAULT 0 CHECK (profit_percentage >= -100 AND profit_percentage <= 100);
  END IF;
END $$;