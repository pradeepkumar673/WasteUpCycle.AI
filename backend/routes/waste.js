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

    console.log('📝 Waste analysis request from user:', req.user.email)
    console.log('📦 Waste data:', { material, category, quantity, unit, condition })

    // Validate required fields
    if (!material || !category || !quantity || !unit) {
      return res.status(400).json({ 
        message: 'Missing required fields: material, category, quantity, unit' 
      })
    }

    // Calculate carbon footprint
    const carbonData = calculateCarbonFootprint(material, quantity, unit)
    console.log('🌱 Carbon calculated:', carbonData)
    
    // Get AI suggestions from Gemini API
    console.log('🤖 Calling AI service...')
    const suggestions = await analyzeWaste(material, category, quantity, unit)
    console.log('✅ AI suggestions received:', suggestions.length)

    // Save to database
    const wasteMaterial = new WasteMaterial({
      userId: req.user._id,
      material,
      category,
      quantity: parseFloat(quantity),
      unit,
      condition: condition || 'clean',
      carbonFootprint: carbonData.ifWasted,
      carbonSavings: carbonData.ifUpcycled,
      suggestions
    })

    await wasteMaterial.save()
    console.log('💾 Saved to database with ID:', wasteMaterial._id)

    // Update user's carbon saved and project count
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      {
        $inc: { 
          carbonSaved: carbonData.ifUpcycled,
          projectsCompleted: 1
        }
      },
      { new: true }
    )

    console.log('👤 User stats updated - Total CO2 saved:', updatedUser.carbonSaved)

    // Send success response
    res.json({
      success: true,
      carbonFootprint: carbonData.ifWasted,
      carbonSavings: carbonData.ifUpcycled,
      suggestions,
      message: `Generated ${suggestions.length} upcycling ideas successfully!`
    })

  } catch (error) {
    console.error('❌ Waste analysis error:', error)
    
    // More specific error messages
    let errorMessage = 'Error analyzing waste material'
    let statusCode = 500

    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided'
      statusCode = 400
    } else if (error.name === 'MongoError') {
      errorMessage = 'Database error occurred'
      statusCode = 503
    }

    res.status(statusCode).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get user's waste analysis history
router.get('/history', auth, async (req, res) => {
  try {
    console.log('📚 Fetching history for user:', req.user.email)
    
    const history = await WasteMaterial.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-suggestions') // Exclude suggestions to reduce payload

    console.log('✅ History fetched:', history.length, 'records')
    
    res.json({
      success: true,
      history,
      count: history.length
    })

  } catch (error) {
    console.error('❌ History fetch error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Error fetching history' 
    })
  }
})

// Get specific analysis by ID
router.get('/history/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    
    const analysis = await WasteMaterial.findOne({ 
      _id: id, 
      userId: req.user._id 
    })

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    res.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('❌ Single analysis fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis'
    })
  }
})

export default router