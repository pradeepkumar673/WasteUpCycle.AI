import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose' // Add this import
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import wasteRoutes from './routes/waste.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to database (but don't crash if it fails)
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/waste', wasteRoutes) // Make sure this line exists

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WasteUpcycle AI API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Using Mock Data'
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server error:', err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('🚨 Unhandled Promise Rejection:', err.message)
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📊 API URL: http://localhost:${PORT}`)
  console.log(`🛣️  Available routes:`)
  console.log(`   - GET  /api/health`)
  console.log(`   - POST /api/auth/register`)
  console.log(`   - POST /api/auth/login`)
  console.log(`   - GET  /api/auth/profile`)
  console.log(`   - GET  /api/waste/categories`)
  console.log(`   - POST /api/waste/analyze`)
  console.log(`   - GET  /api/waste/history`)
})