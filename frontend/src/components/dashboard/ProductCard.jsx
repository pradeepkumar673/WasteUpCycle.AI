import React from 'react'
import { IndianRupee, Leaf, Clock, TrendingUp } from 'lucide-react'

const ProductCard = ({ product, onCardClick }) => {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDemandColor = (demand) => {
    if (demand >= 80) return 'bg-red-500'
    if (demand >= 60) return 'bg-orange-500'
    return 'bg-green-500'
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onCardClick(product)}
    >
      {/* Product Image with Badges */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-2xl flex items-center justify-center">
          <div className="text-4xl">🌱</div>
        </div>
        <div className={`absolute top-4 right-4 ${getDemandColor(product.marketDemand)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
          {product.marketDemand}% Demand
        </div>
        <div className={`absolute top-4 left-4 ${getDifficultyColor(product.difficulty)} px-3 py-1 rounded-full text-sm font-semibold`}>
          {product.difficulty}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {product.productName}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Earns</div>
              <div className="font-bold text-gray-800">{product.earningPotential}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">CO2 Saved</div>
              <div className="font-bold text-gray-800">{product.carbonSavings} kg</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-bold text-gray-800">{product.timeRequired}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">ROI</div>
              <div className={`font-bold ${product.roi > 150 ? 'text-green-600' : product.roi > 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.roi}%
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300">
          View Instructions
        </button>
      </div>
    </div>
  )
}

export default ProductCard