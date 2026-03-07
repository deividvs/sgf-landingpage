/*
  # Add Favorite and Last Accessed Fields to Purchase Simulations
  
  1. Changes
    - Add `is_favorite` (boolean) field to mark favorite simulations
    - Add `last_accessed_at` (timestamp) field to track when simulation was last viewed
    - Add index on last_accessed_at for sorting by recent usage
    - Add index on is_favorite for filtering favorites
  
  2. Notes
    - is_favorite defaults to false
    - last_accessed_at defaults to created_at value
    - Indexes improve query performance for sorting and filtering
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchase_simulations' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE purchase_simulations 
    ADD COLUMN is_favorite boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchase_simulations' AND column_name = 'last_accessed_at'
  ) THEN
    ALTER TABLE purchase_simulations 
    ADD COLUMN last_accessed_at timestamptz DEFAULT now() NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_purchase_simulations_last_accessed_at 
  ON purchase_simulations(last_accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_purchase_simulations_is_favorite 
  ON purchase_simulations(is_favorite);

CREATE INDEX IF NOT EXISTS idx_purchase_simulations_user_favorite 
  ON purchase_simulations(user_id, is_favorite, last_accessed_at DESC);