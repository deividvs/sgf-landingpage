import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('supabase.ts: Initializing Supabase client', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('supabase.ts: Missing environment variables!', {
    supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? '***' : undefined
  });
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('supabase.ts: Supabase client created successfully');

export type Simulation = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  herd_description: string;
  quantity: number;
  initial_weight: number;
  final_weight: number;
  acquisition_value_per_kg: number;
  average_daily_gain: number;
  lease_monthly_per_head: number;
  workers_count: number;
  labor_monthly_per_worker: number;
  supplement_bag_price: number;
  supplement_bag_weight: number;
  supplement_percentage: number;
  supplement_daily_consumption: number;
  other_expenses_monthly_per_head: number;
  arroba_value: number;
  weight_to_gain: number;
  months_to_sell: number;
  total_revenue: number;
  acquisition_costs?: number;
  lease_costs?: number;
  labor_costs?: number;
  supplement_costs?: number;
  other_costs?: number;
  total_expenses: number;
  profit_margin_percentage: number;
  result_per_animal: number;
  cost_per_arroba: number;
};
