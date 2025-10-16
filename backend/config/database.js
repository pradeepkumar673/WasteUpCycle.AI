import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...')
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in environment variables')
      console.log('🔄 Continuing with mock data mode...')
      return
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
      socketTimeoutMS: 45000,
    })
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    console.log('💡 Troubleshooting tips:')
    console.log('1. Check MONGODB_URI in .env file')
    console.log('2. Ensure IP is whitelisted in MongoDB Atlas')
    console.log('3. Verify internet connection')
    console.log('🔄 Continuing with mock data mode...')
  }
}

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected')
})

export default connectDB