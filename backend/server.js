import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import wasteRoutes from './routes/waste.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/waste', wasteRoutes)

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'WasteUpcycle AI API is running!' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})