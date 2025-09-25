import React from 'react'
import { useSelector } from 'react-redux'
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  TrendingUp,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react'
import { RootState } from '../lib/store'

// Mock data for compliance rules
const mockRules = [
  {
    id: 1,
    name: "MRP Declaration Mandatory",
    priority: "High",
    violations: 23,
    status: "Active",
    description: "All products must display Maximum Retail Price clearly",
    category: "Pricing"
  },
  {
    id: 2,
    name: "Ingredient List Completeness",
    priority: "High",
    violations: 8,
    status: "Active",
    description: "Complete ingredient list with allergen information",
    category: "Labeling"
  },
  {
    id: 3,
    name: "Expiry Date Format",
    priority: "Medium",
    violations: 15,
    status: "Active",
    description: "Standardized date format for expiration dates",
    category: "Safety"
  },
  {
    id: 4,
    name: "Nutritional Information Display",
    priority: "Medium",
    violations: 4,
    status: "Active",
    description: "Nutritional facts table as per regulations",
    category: "Health"
  },
  {
    id: 5,
    name: "Country of Origin Declaration",
    priority: "Low",
    violations: 12,
    status: "Inactive",
    description: "Clear indication of product origin country",
    category: "Trade"
  },
  {
    id: 6,
    name: "Batch Number Visibility",
    priority: "Low",
    violations: 3,
    status: "Active",
    description: "Batch/lot number must be clearly visible",
    category: "Traceability"
  }
]

const RulesEngine: React.FC = () => {
  // Calculate statistics from mock data
  const totalRules = mockRules.length
  const activeRules = mockRules.filter(rule => rule.status === 'Active').length
  const highPriorityRules = mockRules.filter(rule => rule.priority === 'High').length
  const totalViolations = mockRules.reduce((sum, rule) => sum + rule.violations, 0)

  const metricCards = [
    {
      title: "Total Rules",
      value: totalRules.toString(),
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      trend: "+2",
      trendUp: true
    },
    {
      title: "Active Rules",
      value: activeRules.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      trend: "+1",
      trendUp: true
    },
    {
      title: "High Priority",
      value: highPriorityRules.toString(),
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
      trend: "0",
      trendUp: true
    },
    {
      title: "Total Violations",
      value: totalViolations.toString(),
      icon: Target,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      trend: "-8",
      trendUp: true
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-orange-600 bg-orange-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'text-green-700 bg-green-100' 
      : 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Rules Engine</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage compliance rules and monitor violation patterns</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-colors duration-200">
              Add New Rule
            </button>
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.title}
              className={`group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border ${metric.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 hover:scale-[1.02] animate-fade-in touch-manipulation`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${metric.bgColor} p-2.5 sm:p-3 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${
                  metric.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${metric.trendUp ? '' : 'rotate-180'}`} />
                  <span>{metric.trend}</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{metric.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compliance Rules Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="p-4 sm:p-6 border-b border-gray-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Compliance Rules</h3>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor all compliance rules</p>
            </div>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Pricing</option>
                <option>Labeling</option>
                <option>Safety</option>
                <option>Health</option>
                <option>Trade</option>
                <option>Traceability</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {mockRules.map((rule, index) => (
                <tr 
                  key={rule.id} 
                  className="hover:bg-gray-50/50 transition-colors duration-200 animate-fade-in"
                  style={{ animationDelay: `${600 + (index * 50)}ms` }}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                      <div className="text-xs text-gray-600 mt-1 max-w-xs">{rule.description}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      {rule.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{rule.violations}</span>
                      {rule.violations > 10 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit Rule"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RulesEngine