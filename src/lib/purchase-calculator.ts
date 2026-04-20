export interface SupplierData {
  name: string;
  city: string;
  distance_km: number;
  quantity: number;
  weight_kg: number;
  price_per_kg: number;
  price_per_head: number;
  commission_percentage: number;
  commission_value: number;
  icms_percentage: number;
  icms_value: number;
  freight_per_km: number;
  toll_value: number;
  freight_per_head: number;
  final_price_per_head: number;
  final_price_total: number;
  quality_score: number;
  cost_per_arroba: number;
  cost_per_kg: number;
}

export interface PurchaseSimulationInputs {
  suppliers: {
    name: string;
    city: string;
    distance_km: number;
    quantity: number;
    weight_kg: number;
    price_per_kg: number;
    commission_percentage: number;
    icms_percentage: number;
    freight_per_km: number;
    toll_value: number;
    quality_score: number;
  }[];
}

export interface PurchaseSimulationResults {
  suppliers: SupplierData[];
  best_supplier_index: number;
}

export function calculatePurchaseSimulation(
  inputs: PurchaseSimulationInputs
): PurchaseSimulationResults {
  const suppliers: SupplierData[] = inputs.suppliers.map((supplier) => {
    const price_per_head = supplier.weight_kg * supplier.price_per_kg;

    const commission_value =
      (price_per_head * supplier.commission_percentage) / 100;

    const icms_value = (price_per_head * supplier.icms_percentage) / 100;

    const total_freight = supplier.distance_km * supplier.freight_per_km;
    const toll_per_head = supplier.quantity > 0 ? supplier.toll_value / supplier.quantity : 0;
    const freight_per_head = total_freight / supplier.quantity + toll_per_head;

    const final_price_per_head =
      price_per_head + commission_value + icms_value + freight_per_head;

    const final_price_total = final_price_per_head * supplier.quantity;

    const cost_per_arroba = final_price_per_head / (supplier.weight_kg / 15);

    const cost_per_kg = final_price_per_head / supplier.weight_kg;

    return {
      name: supplier.name,
      city: supplier.city,
      distance_km: supplier.distance_km,
      quantity: supplier.quantity,
      weight_kg: supplier.weight_kg,
      price_per_kg: supplier.price_per_kg,
      price_per_head: price_per_head,
      commission_percentage: supplier.commission_percentage,
      commission_value: commission_value,
      icms_percentage: supplier.icms_percentage,
      icms_value: icms_value,
      freight_per_km: supplier.freight_per_km,
      toll_value: supplier.toll_value,
      freight_per_head: freight_per_head,
      final_price_per_head: final_price_per_head,
      final_price_total: final_price_total,
      quality_score: supplier.quality_score,
      cost_per_arroba: cost_per_arroba,
      cost_per_kg: cost_per_kg,
    };
  });

  let best_supplier_index = 0;
  let best_score = -Infinity;

  suppliers.forEach((supplier, index) => {
    const normalized_cost = 1 - (supplier.cost_per_kg / Math.max(...suppliers.map(s => s.cost_per_kg)));
    const normalized_quality = supplier.quality_score / 10;

    const score = normalized_cost * 0.6 + normalized_quality * 0.4;

    if (score > best_score) {
      best_score = score;
      best_supplier_index = index;
    }
  });

  return {
    suppliers,
    best_supplier_index,
  };
}
