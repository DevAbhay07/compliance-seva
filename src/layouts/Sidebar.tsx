import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  ScanLine, 
  FileText, 
  Settings, 
  Activity,
  CheckCircle
} from 'lucide-react'
import { RootState } from '../lib/store'
import { setCurrentPage } from '../lib/slices/uiSlice'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { currentPage } = useSelector((state: RootState) => state.ui)

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/dashboard',
      description: 'Analytics and compliance metrics',
      isProminent: true,
      status: 'Active',
      statusColor: 'bg-green-500'
    },
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      path: '/',
      description: 'Landing page and overview'
    },
    { 
      id: 'scanner', 
      label: 'Scanner', 
      icon: ScanLine, 
      path: '/scanner',
      description: 'AI-powered label scanning'
    },
    { 
      id: 'records', 
      label: 'Records', 
      icon: FileText, 
      path: '/records',
      description: 'Compliance history and reports'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      description: 'User profile and preferences'
    }
  ]

  const handleItemClick = (itemId: string) => {
    dispatch(setCurrentPage(itemId))
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-r border-gray-200/60 z-40 transition-all duration-300 ease-in-out shadow-xl ${
        isOpen 
          ? 'w-64 translate-x-0 lg:translate-x-0' 
          : 'w-16 -translate-x-full lg:translate-x-0'
      }`}
    >
      <nav className={`h-full flex flex-col ${isOpen ? 'p-4' : 'p-2'} space-y-3`}>
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          if (item.isProminent) {
            return (
              <div key={item.id} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item.id)}
                  className={`group relative flex items-center ${isOpen ? 'p-4' : 'p-3 justify-center'} rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    active 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200' 
                      : 'bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-100 text-gray-700 hover:text-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className={`flex items-center ${isOpen ? 'space-x-3 w-full' : 'justify-center'}`}>
                    <div className={`${isOpen ? 'p-2.5' : 'p-2'} rounded-lg transition-all duration-300 ${
                      active 
                        ? 'bg-white/20 scale-110' 
                        : 'bg-purple-100 group-hover:bg-purple-200 group-hover:scale-105'
                    }`}>
                      <Icon className={`${isOpen ? 'w-5 h-5' : 'w-4 h-4'} ${active ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    
                    {isOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold text-sm truncate ${
                            active ? 'text-white' : 'text-gray-900 group-hover:text-purple-700'
                          }`}>
                            {item.label}
                          </p>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${item.statusColor || 'bg-green-500'} ${
                              active ? 'animate-pulse' : ''
                            }`}></div>
                            {active && <CheckCircle className="w-3 h-3 text-white/80" />}
                          </div>
                        </div>
                        <p className={`text-xs mt-1 truncate transition-all duration-200 ${
                          active ? 'text-white/80' : 'text-gray-500 group-hover:text-purple-600'
                        }`}>
                          {item.status || 'Ready'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {active && isOpen && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-sm"></div>
                  )}
                  {active && !isOpen && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full shadow-sm"></div>
                  )}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          } else {
            return (
              <div key={item.id} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item.id)}
                  className={`group flex items-center ${isOpen ? 'p-3' : 'p-2 justify-center'} rounded-xl transition-all duration-300 transform hover:scale-[1.01] relative overflow-hidden ${
                    active 
                      ? 'bg-purple-100 text-purple-700 shadow-md scale-[1.01]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    active ? 'opacity-100' : ''
                  }`}></div>
                  
                  <div className={`relative flex items-center ${isOpen ? 'space-x-3 w-full' : 'justify-center'}`}>
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      active 
                        ? 'bg-purple-200 text-purple-700 scale-105' 
                        : 'bg-gray-100 group-hover:bg-gray-200 text-gray-500 group-hover:text-gray-700 group-hover:scale-105'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    {isOpen && (
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate transition-all duration-200 ${
                          active ? 'text-purple-700' : 'group-hover:text-gray-900'
                        }`}>
                          {item.label}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {active && isOpen && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-l-full"></div>
                  )}
                  {active && !isOpen && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-purple-600 rounded-l-full"></div>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
        })}

        <div className="flex-1"></div>

        {isOpen && (
          <div className="mt-auto">
            <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-xl p-4 border border-purple-200 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-purple-900">System Status</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-purple-600">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
