// Carbon emission factors (kg CO2 per kg of material) - expanded list
const emissionFactors = {
  // Existing materials
  plastic: 2.5,
  paper: 0.8,
  metal: 1.8,
  glass: 0.9,
  textile: 3.0,
  electronic: 5.2,
  organic: 0.5,
  wood: 0.3,
  rubber: 2.2,
  
  // New common materials
  furniture: 1.2,
  packaging: 1.8,
  construction: 2.1,
  automotive: 3.5,
  household: 1.5,
  industrial: 4.2,
  mixed: 1.8
}

// Upcycling efficiency (percentage reduction in emissions)
const upcyclingEfficiency = 0.8

export const calculateCarbonFootprint = (material, quantity, unit) => {
  // Convert to kg for calculation
  let quantityInKg = quantity
  if (unit === 'pieces') quantityInKg = quantity * 0.05 // Average piece weight
  if (unit === 'liters') quantityInKg = quantity * 0.5 // Average density
  if (unit === 'meters') quantityInKg = quantity * 0.1 // Average linear density

  // Find the best matching emission factor
  const materialLower = material.toLowerCase()
  let baseEmission = emissionFactors.mixed // Default
  
  // Smart matching for dynamic materials
  for (const [key, value] of Object.entries(emissionFactors)) {
    if (materialLower.includes(key)) {
      baseEmission = value
      break
    }
  }

  const ifWasted = baseEmission * quantityInKg
  const ifUpcycled = ifWasted * upcyclingEfficiency

  return {
    ifWasted: Math.round(ifWasted * 10) / 10,
    ifUpcycled: Math.round(ifUpcycled * 10) / 10
  }
}