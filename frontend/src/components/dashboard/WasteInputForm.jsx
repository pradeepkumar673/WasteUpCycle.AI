import React, { useState, useEffect } from 'react'
import { UNITS } from '../../utils/constants'
import { wasteAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const WasteInputForm = ({ onAnalyze }) => {
  const [formData, setFormData] = useState({
    material: '',
    category: '',
    quantity: '',
    unit: 'kg',
    condition: 'clean'
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [error, setError] = useState('')

  // Fetch categories when material changes
  useEffect(() => {
    const fetchCategories = async () => {
      const material = formData.material.trim()
      
      if (material.length < 2) {
        setCategories([])
        setError('')
        return
      }

      setLoadingCategories(true)
      setError('')
      try {
        console.log('🔄 Fetching categories for:', material)
        const response = await wasteAPI.getCategories(material)
        console.log('✅ Categories response:', response)
        
        if (response.success && response.categories && response.categories.length > 0) {
          setCategories(response.categories)
          setError('')
        } else {
          setCategories([])
          setError('No categories found for this material')
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
        // Use fallback categories even if API fails
        const fallbackCategories = getFallbackCategories(material)
        setCategories(fallbackCategories)
        setError('Using suggested categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(fetchCategories, 800)
    return () => clearTimeout(timeoutId)
  }, [formData.material])

  // Fallback categories function for frontend
  const getFallbackCategories = (material = '') => {
    const materialLower = material.toLowerCase();
    
    if (materialLower.includes('plastic')) {
      return ['Bottles', 'Containers', 'Bags', 'Packaging', 'Toys'];
    } else if (materialLower.includes('wood') || materialLower.includes('timber')) {
      return ['Furniture', 'Pallets', 'Construction', 'Packaging', 'Natural'];
    } else if (materialLower.includes('metal')) {
      return ['Cans', 'Foils', 'Wires', 'Utensils', 'Scrap'];
    } else if (materialLower.includes('glass')) {
      return ['Bottles', 'Jars', 'Windows', 'Containers', 'Broken'];
    } else if (materialLower.includes('textile') || materialLower.includes('cloth')) {
      return ['Cotton', 'Denim', 'Wool', 'Synthetic', 'Mixed'];
    } else if (materialLower.includes('electronic') || materialLower.includes('e-waste')) {
      return ['Phones', 'Computers', 'Wires', 'Batteries', 'Appliances'];
    } else if (materialLower.includes('paper') || materialLower.includes('cardboard')) {
      return ['Newspaper', 'Cardboard', 'Books', 'Packaging', 'Office'];
    } else if (materialLower.includes('organic') || materialLower.includes('food')) {
      return ['Food Waste', 'Garden Waste', 'Agricultural', 'Compost', 'Mixed'];
    } else {
      return ['Household', 'Industrial', 'Packaging', 'Construction', 'Mixed'];
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.material && formData.category && formData.quantity) {
      onAnalyze(formData)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        What Waste Do You Have?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Type *
          </label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => setFormData({
              ...formData, 
              material: e.target.value,
              category: '' // Reset category when material changes
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., plastic bottles, old furniture, electronic waste..."
            required
          />
          {loadingCategories && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
              <LoadingSpinner size="small" />
              <span>Finding categories...</span>
            </div>
          )}
        </div>

        {/* Dynamic Category Selection */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Show messages */}
        {formData.material && !loadingCategories && categories.length === 0 && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            Type more to see categories for "{formData.material}"
          </div>
        )}

        {error && (
          <div className={`text-sm p-3 rounded-lg ${
            error.includes('Using suggested') 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {error}
          </div>
        )}

        {/* Quantity and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 5"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit *
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {UNITS.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="clean">Clean</option>
            <option value="contaminated">Contaminated</option>
            <option value="mixed">Mixed</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!formData.material || !formData.category || !formData.quantity}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Generate AI-Powered Ideas
        </button>
      </form>
    </div>
  )
}

export default WasteInputForm