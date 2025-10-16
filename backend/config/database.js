import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...')
    
    const conn = await mongoose.connect(
      process.env.MONGODB_URI, 
      {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        maxPoolSize: 10, // Maximum number of connections
      }
    )
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    console.log('💡 Troubleshooting tips:')
    console.log('1. Check your MongoDB Atlas connection string')
    console.log('2. Ensure your IP is whitelisted in MongoDB Atlas')
    console.log('3. Check your internet connection')
    console.log('4. Verify database name exists in Atlas')
    
    // Don't crash the app - allow it to start with mock data
    console.log('🔄 Continuing with mock data mode...')
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
})

export default connectDB