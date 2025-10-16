import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import WasteInputForm from '../components/dashboard/WasteInputForm'
import ProductCard from '../components/dashboard/ProductCard'
import ProductModal from '../components/dashboard/ProductModal'
import CarbonCalculator from '../components/dashboard/CarbonCalculator'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleAnalyze = async (wasteData) => {
    setLoading(true)
    try {
      // Simulated API call - replace with actual API
      const mockResults = {
        carbonFootprint: 12.5,
        carbonSavings: 10.2,
        suggestions: [
          {
            id: '1',
            productName: 'Plastic Bottle Planters',
            description: 'Create beautiful vertical gardens using plastic bottles',
            imageUrl: '/api/placeholder/300/200',
            difficulty: 'Beginner',
            estimatedCost: 150,
            sellingPriceRange: '₹200-500',
            earningPotential: '₹50-350',
            carbonSavings: 8.5,
            marketDemand: 85,
            roi: 150,
            timeRequired: '2-3 hours',
            materialsNeeded: ['Plastic bottles', 'Soil', 'Seeds', 'Rope'],
            toolsRequired: ['Scissors', 'Drill', 'Measuring tape'],
            steps: [
              'Clean and dry plastic bottles thoroughly',
              'Cut bottles horizontally leaving one side attached',
              'Create drainage holes at the bottom',
              'Fill with soil and compost mixture',
              'Plant seeds or saplings and arrange vertically'
            ],
            sellingPlatforms: ['Amazon', 'Flipkart', 'Local Nursery'],
            targetAudience: 'Urban gardeners',
            successRate: '90%',
            customerRating: '4.5/5'
          }
        ]
      }
      setResults(mockResults)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Transform your waste materials into profitable products
        </p>
      </div>

      <WasteInputForm onAnalyze={handleAnalyze} />

      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
          <span className="ml-4 text-gray-600">AI is analyzing your waste...</span>
        </div>
      )}

      {results && (
        <div className="mt-12">
          <CarbonCalculator data={results} />
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              AI-Powered Upcycling Ideas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.suggestions.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard