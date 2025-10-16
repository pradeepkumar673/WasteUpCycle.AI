import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout