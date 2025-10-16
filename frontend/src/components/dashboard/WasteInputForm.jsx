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

  // Fetch categories when material changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.material.trim().length < 2) {
        setCategories([])
        return
      }

      setLoadingCategories(true)
      try {
        // We'll create a new API endpoint for getting categories
        const response = await wasteAPI.getCategories(formData.material)
        setCategories(response.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(fetchCategories, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.material])

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

        {/* Show message if no categories found */}
        {formData.material && !loadingCategories && categories.length === 0 && (
          <div className="text-sm text-gray-500">
            Start typing to see available categories for "{formData.material}"
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