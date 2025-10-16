import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Recycle, Users, Leaf, IndianRupee, TrendingUp } from 'lucide-react'

const LandingPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Turn Your <span className="text-green-600">Waste into Wealth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered upcycling solutions that show you exactly what to make, 
            how much you can earn in ₹, and how much CO2 you'll save.
          </p>
          <Link 
            to={user ? "/dashboard" : "/register"}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 inline-block"
          >
            Start Transforming Waste
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">10,000+</div>
              <div className="text-gray-600">Users Transforming Waste</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">50,000+ kg</div>
              <div className="text-gray-600">CO2 Emissions Saved</div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <IndianRupee className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">₹25L+</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800">120%</div>
              <div className="text-gray-600">Average ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Input Your Waste</h3>
              <p className="text-gray-600">
                Tell us what waste materials you have - plastic, paper, metal, or any other type.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Get AI Suggestions</h3>
              <p className="text-gray-600">
                Our AI analyzes your waste and suggests profitable upcycling ideas with market data.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Create & Sell</h3>
              <p className="text-gray-600">
                Follow step-by-step instructions to create products and sell them for profit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage