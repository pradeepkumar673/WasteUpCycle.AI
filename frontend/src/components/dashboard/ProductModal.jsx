import React from 'react'
import { X, IndianRupee, Users, Star, TrendingUp } from 'lucide-react'

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.productName}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{product.earningPotential}</div>
              <div className="text-sm text-gray-600">Potential Earnings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{product.marketDemand}%</div>
              <div className="text-sm text-gray-600">Market Demand</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Star className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{product.carbonSavings} kg</div>
              <div className="text-sm text-gray-600">CO2 Saved</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{product.roi}%</div>
              <div className="text-sm text-gray-600">ROI</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Instructions</h3>
              <div className="space-y-3">
                {product.steps.map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Materials & Tools */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Materials & Tools Required</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Materials:</h4>
                    <ul className="space-y-1">
                      {product.materialsNeeded.map((material, index) => (
                        <li key={index} className="text-sm text-gray-600">• {material}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tools:</h4>
                    <ul className="space-y-1">
                      {product.toolsRequired.map((tool, index) => (
                        <li key={index} className="text-sm text-gray-600">• {tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Market Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Market Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selling Platforms:</span>
                    <span className="font-medium">{product.sellingPlatforms.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Customers:</span>
                    <span className="font-medium">{product.targetAudience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Rating:</span>
                    <span className="font-medium text-yellow-600">{product.customerRating}</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Investment Required:</span>
                    <span className="font-bold">₹{product.estimatedCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Selling Price:</span>
                    <span className="font-bold text-green-600">{product.sellingPriceRange}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Net Profit Range:</span>
                    <span className="font-bold text-green-600">{product.earningPotential}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal