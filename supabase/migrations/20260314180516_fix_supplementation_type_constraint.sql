/*
  # Fix supplementation_type constraint

  1. Changes
    - Drop existing constraint on supplementation_calculations.supplementation_type
    - Add new constraint with correct values matching the application code
    
  2. Details
    - Updated to accept: proteinado_01, proteinado_02, proteico_energetico_03, 
      proteico_energetico_04, proteico_energetico_05, concentrado_engorda_1,
      concentrado_engorda_15, concentrado_engorda_2, custom
    - This matches the SupplementationType enum in the frontend
*/

ALTER TABLE supplementation_calculations
DROP CONSTRAINT IF EXISTS supplementation_calculations_supplementation_type_check;

ALTER TABLE supplementation_calculations
ADD CONSTRAINT supplementation_calculations_supplementation_type_check
CHECK (supplementation_type = ANY (ARRAY[
  'proteinado_01'::text,
  'proteinado_02'::text,
  'proteico_energetico_03'::text,
  'proteico_energetico_04'::text,
  'proteico_energetico_05'::text,
  'concentrado_engorda_1'::text,
  'concentrado_engorda_15'::text,
  'concentrado_engorda_2'::text,
  'custom'::text
]));