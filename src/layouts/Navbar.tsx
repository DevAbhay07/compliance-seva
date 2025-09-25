import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, User, ExternalLink } from 'lucide-react'
import Logo from '../components/Logo'

interface NavbarProps {
  onToggleSidebar: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate('/settings')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Government of India Banner - Exactly 24px (h-6) */}
      <div className="bg-purple-600 text-white px-4 text-xs h-6 flex items-center">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-sm"></div>
            <a 
              href="https://www.india.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-200 transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Government of India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation - Exactly 40px (h-10) - Total: 64px (h-16) */}
      <div className="px-3 sm:px-4 h-10 flex items-center border-0 m-0">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 touch-manipulation"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <Logo size="md" showText={true} className="hidden sm:flex" />
            <Logo size="sm" className="flex sm:hidden" />
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all duration-200 outline-none"
              />
            </div>

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 relative hover:scale-105 active:scale-95 touch-manipulation">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">3</span>
            </button>

            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
              aria-label="Go to Settings"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
