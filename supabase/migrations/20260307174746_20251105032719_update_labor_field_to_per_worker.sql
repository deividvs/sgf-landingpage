/*
  # Update Labor Cost Structure

  ## Changes
  This migration renames the `labor_monthly_total` column to `labor_monthly_per_worker` 
  to better reflect the actual data being stored (salary per individual worker, not the 
  total monthly cost).

  ## Rationale
  The calculation logic multiplies `labor_monthly_per_worker` by `workers_count` to get 
  the total monthly labor cost. This makes the data model clearer and the calculations 
  more accurate.

  ## Notes
  - Uses ALTER TABLE to rename the column
  - Maintains all existing constraints and defaults
  - Data is preserved during the rename operation
*/

-- Rename the column from labor_monthly_total to labor_monthly_per_worker
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'simulations' 
    AND column_name = 'labor_monthly_total'
  ) THEN
    ALTER TABLE simulations 
    RENAME COLUMN labor_monthly_total TO labor_monthly_per_worker;
  END IF;
END $$;