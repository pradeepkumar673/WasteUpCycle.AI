import React from 'react'
import { Leaf, Trees, Car, Droplets } from 'lucide-react'

const CarbonCalculator = ({ data }) => {
  const equivalents = {
    trees: Math.round(data.carbonSavings / 21), // 21kg CO2 per tree per year
    cars: (data.carbonSavings / 4200).toFixed(2), // 4200kg CO2 per car per year
    water: Math.round(data.carbonSavings * 100) // Simplified calculation
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Environmental Impact</h2>
      
      {/* Carbon Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center p-6 bg-red-50 rounded-xl">
          <Leaf className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-red-600">+{data.carbonFootprint} kg</div>
          <div className="text-red-700 font-semibold">CO2 if Wasted</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-green-600">-{data.carbonSavings} kg</div>
          <div className="text-green-700 font-semibold">CO2 Saved by Upcycling</div>
        </div>
      </div>

      {/* Environmental Equivalents */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Trees className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">{equivalents.trees}</div>
          <div className="text-sm text-gray-600">Trees Equivalent</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <Car className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">{equivalents.cars}</div>
          <div className="text-sm text-gray-600">Cars Off Road</div>
        </div>
        <div className="text-center p-4 bg-cyan-50 rounded-lg">
          <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">{equivalents.water}L</div>
          <div className="text-sm text-gray-600">Water Saved</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Leaf className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">{data.carbonSavings}kg</div>
          <div className="text-sm text-gray-600">Landfill Reduced</div>
        </div>
      </div>
    </div>
  )
}

export default CarbonCalculator