import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight
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
  // Modal and form state
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingRule, setEditingRule] = useState<typeof mockRules[0] | null>(null)
  const [viewingRule, setViewingRule] = useState<typeof mockRules[0] | null>(null)
  const [deletingRule, setDeletingRule] = useState<typeof mockRules[0] | null>(null)
  const [rules, setRules] = useState(mockRules)
  const [formData, setFormData] = useState({
    ruleName: '',
    description: '',
    field: '',
    condition: '',
    category: '',
    priority: '',
    value: ''
  })

  // Calculate statistics from current rules
  const totalRules = rules.length
  const activeRules = rules.filter(rule => rule.status === 'Active').length
  const highPriorityRules = rules.filter(rule => rule.priority === 'High').length
  const totalViolations = rules.reduce((sum, rule) => sum + rule.violations, 0)

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateRule = () => {
    if (!formData.ruleName || !formData.description || !formData.category || !formData.priority) {
      alert('Please fill in all required fields')
      return
    }

    const newRule = {
      id: rules.length + 1,
      name: formData.ruleName,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      violations: 0,
      status: 'Active' as const
    }

    setRules(prev => [...prev, newRule])
    setShowModal(false)
    setFormData({
      ruleName: '',
      description: '',
      field: '',
      condition: '',
      category: '',
      priority: '',
      value: ''
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRule(null)
    setFormData({
      ruleName: '',
      description: '',
      field: '',
      condition: '',
      category: '',
      priority: '',
      value: ''
    })
  }

  // New handler functions
  const handleViewRule = (rule: typeof mockRules[0]) => {
    setViewingRule(rule)
    setShowViewModal(true)
  }

  const handleEditRule = (rule: typeof mockRules[0]) => {
    setEditingRule(rule)
    setFormData({
      ruleName: rule.name,
      description: rule.description,
      field: '',
      condition: '',
      category: rule.category,
      priority: rule.priority,
      value: ''
    })
    setShowModal(true)
  }

  const handleUpdateRule = () => {
    if (!editingRule || !formData.ruleName || !formData.description || !formData.category || !formData.priority) {
      alert('Please fill in all required fields')
      return
    }

    setRules(prev => prev.map(rule => 
      rule.id === editingRule.id 
        ? { ...rule, name: formData.ruleName, description: formData.description, category: formData.category, priority: formData.priority }
        : rule
    ))
    handleCloseModal()
  }

  const handleDeleteConfirm = (rule: typeof mockRules[0]) => {
    setDeletingRule(rule)
    setShowDeleteModal(true)
  }

  const handleDeleteRule = () => {
    if (deletingRule) {
      setRules(prev => prev.filter(rule => rule.id !== deletingRule.id))
      setShowDeleteModal(false)
      setDeletingRule(null)
    }
  }

  const handleToggleStatus = (ruleId: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'Active' ? 'Inactive' : 'Active' }
        : rule
    ))
  }

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
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Rules Engine</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage compliance rules and monitor violation patterns</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-colors duration-200 touch-manipulation"
            >
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
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Compliance Rules</h3>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor all compliance rules</p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
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

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {rules.map((rule, index) => (
                <tr 
                  key={rule.id} 
                  className="hover:bg-gray-50/50 transition-colors duration-200 animate-fade-in"
                  style={{ animationDelay: `${600 + (index * 50)}ms` }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                      <div className="text-xs text-gray-600 mt-1 max-w-xs">{rule.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      {rule.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{rule.violations}</span>
                      {rule.violations > 10 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleStatus(rule.id)}
                      className="flex items-center space-x-2 group transition-all duration-200"
                      title={`Toggle status (currently ${rule.status})`}
                    >
                      {rule.status === 'Active' ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-500 group-hover:text-green-600" />
                          <span className="text-green-700 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
                          <span className="text-gray-600 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewRule(rule)}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRule(rule)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit Rule"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirm(rule)}
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

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200/60">
          {rules.map((rule, index) => (
            <div 
              key={rule.id}
              className="p-4 sm:p-6 animate-fade-in"
              style={{ animationDelay: `${600 + (index * 50)}ms` }}
            >
              <div className="space-y-3">
                {/* Rule Name and Description */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">{rule.name}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>

                {/* Rule Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</span>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                        {rule.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</span>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{rule.violations}</span>
                      {rule.violations > 10 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                    <div className="mt-1">
                      <button
                        onClick={() => handleToggleStatus(rule.id)}
                        className="flex items-center space-x-2 group transition-all duration-200"
                        title={`Toggle status (currently ${rule.status})`}
                      >
                        {rule.status === 'Active' ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-green-500 group-hover:text-green-600" />
                            <span className="text-green-700 font-medium text-xs">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-500" />
                            <span className="text-gray-600 font-medium text-xs">Inactive</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleViewRule(rule)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200 touch-manipulation"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditRule(rule)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 touch-manipulation"
                      title="Edit Rule"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm(rule)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 touch-manipulation"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Rule Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  placeholder="Enter rule name"
                  value={formData.ruleName}
                  onChange={(e) => handleInputChange('ruleName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this rule validates"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                />
              </div>

              {/* Field and Condition Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., mrp"
                    value={formData.field}
                    onChange={(e) => handleInputChange('field', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                  >
                    <option value="">Select condition</option>
                    <option value="required">Required</option>
                    <option value="format">Format</option>
                    <option value="range">Range</option>
                    <option value="pattern">Pattern</option>
                    <option value="length">Length</option>
                  </select>
                </div>
              </div>

              {/* Category and Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Labeling">Labeling</option>
                    <option value="Safety">Safety</option>
                    <option value="Health">Health</option>
                    <option value="Trade">Trade</option>
                    <option value="Traceability">Traceability</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
                  >
                    <option value="">Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Value (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., DD/MM/YYYY or 0.1-100"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={editingRule ? handleUpdateRule : handleCreateRule}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Rule Modal */}
      {showViewModal && viewingRule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Rule Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Rule Name and Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{viewingRule.name}</h3>
                  <div className="flex items-center space-x-2">
                    {viewingRule.status === 'Active' ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{viewingRule.description}</p>
              </div>

              {/* Rule Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                  <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {viewingRule.category}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
                  <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getPriorityColor(viewingRule.priority)}`}>
                    {viewingRule.priority}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Total Violations</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{viewingRule.violations}</span>
                    {viewingRule.violations > 10 && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Rule ID</h4>
                  <span className="text-gray-900 font-mono">{viewingRule.id}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEditRule(viewingRule)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Rule</span>
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-red-600">Delete Rule</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Are you sure you want to delete this rule?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>{deletingRule.name}</strong> will be permanently removed. This action cannot be undone.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Impact:</strong> This rule has {deletingRule.violations} recorded violations that will no longer be tracked.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRule}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Rule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RulesEngine