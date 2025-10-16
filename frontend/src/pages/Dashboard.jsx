import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import WasteInputForm from '../components/dashboard/WasteInputForm'
import ProductCard from '../components/dashboard/ProductCard'
import ProductModal from '../components/dashboard/ProductModal'
import CarbonCalculator from '../components/dashboard/CarbonCalculator'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { wasteAPI } from '../services/api' // Add this import

const Dashboard = () => {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (wasteData) => {
    setLoading(true)
    setError('')
    setResults(null)
    
    try {
      console.log('🔄 Sending waste data to API:', wasteData)
      
      // Call the actual API instead of using mock data
      const response = await wasteAPI.analyze(wasteData)
      console.log('✅ API Response:', response.data)
      
      if (response.data.success) {
        setResults(response.data)
      } else {
        throw new Error(response.data.message || 'Analysis failed')
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error)
      setError(error.response?.data?.message || 'Failed to analyze waste material. Please try again.')
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

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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