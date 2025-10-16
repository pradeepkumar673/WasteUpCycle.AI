import express from 'express'
import auth from '../middleware/auth.js'
import WasteMaterial from '../models/WasteMaterial.js'
import User from '../models/User.js'
import { analyzeWaste } from '../services/geminiService.js'
import { calculateCarbonFootprint } from '../services/carbonCalculator.js'

const router = express.Router()

// Analyze waste material
router.post('/analyze', auth, async (req, res) => {
  try {
    const { material, category, quantity, unit, condition } = req.body

    // Calculate carbon footprint
    const carbonData = calculateCarbonFootprint(material, quantity, unit)
    
    // Get AI suggestions
    const suggestions = await analyzeWaste(material, category, quantity, unit)

    // Save to database
    const wasteMaterial = new WasteMaterial({
      userId: req.user._id,
      material,
      category,
      quantity,
      unit,
      condition,
      carbonFootprint: carbonData.ifWasted,
      carbonSavings: carbonData.ifUpcycled,
      suggestions
    })

    await wasteMaterial.save()

    // Update user's carbon saved
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 
        carbonSaved: carbonData.ifUpcycled,
        projectsCompleted: 1
      }
    })

    res.json({
      carbonFootprint: carbonData.ifWasted,
      carbonSavings: carbonData.ifUpcycled,
      suggestions
    })

  } catch (error) {
    console.error('Waste analysis error:', error)
    res.status(500).json({ message: 'Error analyzing waste material' })
  }
})

// Get user's waste analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await WasteMaterial.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    res.status(500).json({ message: 'Error fetching history' })
  }
})

export default router