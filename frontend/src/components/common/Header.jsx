import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Recycle, User, LogOut } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-green-600">
            <Recycle className="h-8 w-8" />
            <span className="text-xl font-bold">WasteUpcycle AI</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-green-600 transition-colors ${
                location.pathname === '/' ? 'text-green-600 font-semibold' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/dashboard" 
              className={`hover:text-green-600 transition-colors ${
                location.pathname === '/dashboard' ? 'text-green-600 font-semibold' : 'text-gray-600'
              }`}
            >
              Dashboard
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header