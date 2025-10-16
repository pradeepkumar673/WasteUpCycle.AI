import React from 'react'
import { Recycle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Recycle className="h-6 w-6 text-green-400" />
            <span className="text-xl font-bold">WasteUpcycle AI</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              Turning waste into wealth, one idea at a time
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2024 WasteUpcycle AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer