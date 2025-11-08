/*
  # Create Annual Results Appraisal Table

  1. New Tables
    - `annual_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `year` (integer) - Reference year for the cycle
      - `title` (text) - User-defined title for the appraisal
      - `total_heads` (integer) - Total animals finished in the year
      - `total_revenue` (numeric) - Total revenue from cattle sales
      
      Revenue and Cost Breakdown:
      - `cattle_purchase_cost` (numeric) - Total cattle acquisition costs
      - `freight_cost` (numeric) - Transportation costs
      - `commission_cost` (numeric) - Commission fees
      - `personnel_cost` (numeric) - Salaries and labor expenses
      - `pasture_lease_cost` (numeric) - Land rental costs
      - `feed_supplement_medicine_cost` (numeric) - Feed, supplements, and veterinary
      - `taxes_fees_cost` (numeric) - Taxes and regulatory fees
      - `infrastructure_maintenance_cost` (numeric) - Fences, vehicles, maintenance
      - `other_expenses_cost` (numeric) - Miscellaneous expenses
      
      Calculated Results:
      - `total_cost` (numeric) - Sum of acquisition costs
      - `total_operational_expenses` (numeric) - Sum of operational expenses
      - `revenue_per_head` (numeric) - Revenue / total heads
      - `cost_per_head` (numeric) - Total cost / total heads
      - `expense_per_head` (numeric) - Operational expenses / total heads
      - `profit_margin_percentage` (numeric) - Profit margin as percentage
      - `final_result` (numeric) - Profit or loss amount
      
  2. Security
    - Enable RLS on `annual_results` table
    - Add policies for authenticated users to manage their own data
    
  3. Important Notes
    - All cost fields default to 0 to prevent null issues
    - Year must be between 2000 and 2100 for data integrity
    - Total heads and revenue must be positive values
    - Users can only access their own annual results
*/

CREATE TABLE IF NOT EXISTS annual_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  year integer NOT NULL CHECK (year >= 2000 AND year <= 2100),
  title text NOT NULL DEFAULT '',
  total_heads integer NOT NULL CHECK (total_heads > 0),
  total_revenue numeric NOT NULL CHECK (total_revenue > 0),
  
  cattle_purchase_cost numeric NOT NULL DEFAULT 0 CHECK (cattle_purchase_cost >= 0),
  freight_cost numeric NOT NULL DEFAULT 0 CHECK (freight_cost >= 0),
  commission_cost numeric NOT NULL DEFAULT 0 CHECK (commission_cost >= 0),
  personnel_cost numeric NOT NULL DEFAULT 0 CHECK (personnel_cost >= 0),
  pasture_lease_cost numeric NOT NULL DEFAULT 0 CHECK (pasture_lease_cost >= 0),
  feed_supplement_medicine_cost numeric NOT NULL DEFAULT 0 CHECK (feed_supplement_medicine_cost >= 0),
  taxes_fees_cost numeric NOT NULL DEFAULT 0 CHECK (taxes_fees_cost >= 0),
  infrastructure_maintenance_cost numeric NOT NULL DEFAULT 0 CHECK (infrastructure_maintenance_cost >= 0),
  other_expenses_cost numeric NOT NULL DEFAULT 0 CHECK (other_expenses_cost >= 0),
  
  total_cost numeric NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
  total_operational_expenses numeric NOT NULL DEFAULT 0 CHECK (total_operational_expenses >= 0),
  revenue_per_head numeric NOT NULL DEFAULT 0 CHECK (revenue_per_head >= 0),
  cost_per_head numeric NOT NULL DEFAULT 0 CHECK (cost_per_head >= 0),
  expense_per_head numeric NOT NULL DEFAULT 0 CHECK (expense_per_head >= 0),
  profit_margin_percentage numeric NOT NULL DEFAULT 0,
  final_result numeric NOT NULL DEFAULT 0
);

ALTER TABLE annual_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own annual results"
  ON annual_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own annual results"
  ON annual_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own annual results"
  ON annual_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own annual results"
  ON annual_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_annual_results_user_id ON annual_results(user_id);
CREATE INDEX IF NOT EXISTS idx_annual_results_year ON annual_results(year);
CREATE INDEX IF NOT EXISTS idx_annual_results_created_at ON annual_results(created_at DESC);