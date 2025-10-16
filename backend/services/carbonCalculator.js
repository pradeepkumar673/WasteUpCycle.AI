// Carbon emission factors (kg CO2 per kg of material)
const emissionFactors = {
  plastic: 2.5,
  paper: 0.8,
  metal: 1.8,
  glass: 0.9,
  textile: 3.0,
  electronic: 5.2,
  organic: 0.5,
  wood: 0.3,
  rubber: 2.2
}

// Upcycling efficiency (percentage reduction in emissions)
const upcyclingEfficiency = 0.8

export const calculateCarbonFootprint = (material, quantity, unit) => {
  // Convert to kg for calculation
  let quantityInKg = quantity
  if (unit === 'pieces') quantityInKg = quantity * 0.05 // Average piece weight
  if (unit === 'liters') quantityInKg = quantity * 0.5 // Average density
  if (unit === 'meters') quantityInKg = quantity * 0.1 // Average linear density

  const baseEmission = emissionFactors[material.toLowerCase()] || 1.5
  const ifWasted = baseEmission * quantityInKg
  const ifUpcycled = ifWasted * upcyclingEfficiency

  return {
    ifWasted: Math.round(ifWasted * 10) / 10,
    ifUpcycled: Math.round(ifUpcycled * 10) / 10
  }
}