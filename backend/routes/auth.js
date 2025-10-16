import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    user = new User({ name, email, password })
    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        carbonSaved: user.carbonSaved,
        projectsCompleted: user.projectsCompleted
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        carbonSaved: user.carbonSaved,
        projectsCompleted: user.projectsCompleted
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        carbonSaved: req.user.carbonSaved,
        projectsCompleted: req.user.projectsCompleted
      }
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router