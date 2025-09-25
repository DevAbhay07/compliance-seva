import React, { ReactNode } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from '../lib/store'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { toggleSidebar } from '../lib/slices/uiSlice'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const location = useLocation()
  
  const isHomePage = location.pathname === '/'

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Navbar at Top */}
      <Navbar onToggleSidebar={handleToggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content Area - pt-16 matches navbar height exactly (64px) */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out pt-16 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      }`}>
        {/* Page Content with fade-in animation and responsive padding */}
        <main className={`flex-1 overflow-auto ${
          isHomePage 
            ? 'bg-transparent' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          {isHomePage ? (
            // Home page: no container padding, let it handle its own layout
            <div className="animate-fade-in">
              {children}
            </div>
          ) : (
            // Other pages: use container with padding, ensure tight alignment
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl animate-fade-in">
              <div className="transition-all duration-500 ease-out">
                {children}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Mobile Overlay with improved animation and touch support */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30 transition-all duration-300 animate-fade-in touch-none"
          onClick={handleToggleSidebar}
          onTouchStart={handleToggleSidebar}
        />
      )}
    </div>
  )
}

export default MainLayout