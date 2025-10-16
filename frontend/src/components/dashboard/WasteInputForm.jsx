import React, { useState } from 'react'
import { MATERIALS, UNITS } from '../../utils/constants'

const WasteInputForm = ({ onAnalyze }) => {
  const [formData, setFormData] = useState({
    material: '',
    category: '',
    quantity: '',
    unit: 'kg',
    condition: 'clean'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.material && formData.category && formData.quantity) {
      onAnalyze(formData)
    }
  }

  const selectedMaterial = MATERIALS.find(m => m.value === formData.material)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        What Waste Do You Have?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Type *
          </label>
          <select
            value={formData.material}
            onChange={(e) => setFormData({...formData, material: e.target.value, category: ''})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Material</option>
            {MATERIALS.map(material => (
              <option key={material.value} value={material.value}>
                {material.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selection */}
        {formData.material && (
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
              {selectedMaterial?.categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition duration-300"
        >
          Generate AI-Powered Ideas
        </button>
      </form>
    </div>
  )
}

export default WasteInputForm