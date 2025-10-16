import mongoose from 'mongoose'

const wasteMaterialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  material: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    default: 'clean'
  },
  carbonFootprint: {
    type: Number,
    required: true
  },
  carbonSavings: {
    type: Number,
    required: true
  },
  suggestions: [{
    _id: false, // Add this to disable automatic _id generation for suggestions
    id: String, // Change this from _id to id and make it String type
    productName: String,
    description: String,
    difficulty: String,
    estimatedCost: Number,
    sellingPriceRange: String,
    earningPotential: String,
    carbonSavings: Number,
    marketDemand: Number,
    roi: Number,
    timeRequired: String,
    materialsNeeded: [String],
    toolsRequired: [String],
    steps: [String],
    sellingPlatforms: [String],
    targetAudience: String,
    successRate: String,
    customerRating: String
  }]
}, {
  timestamps: true
})

export default mongoose.model('WasteMaterial', wasteMaterialSchema)