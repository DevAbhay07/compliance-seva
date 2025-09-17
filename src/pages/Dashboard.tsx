import React from 'react'
import { useSelector } from 'react-redux'
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Clock,
  Users,
  Target
} from 'lucide-react'
import { RootState } from '../lib/store'

const Dashboard: React.FC = () => {
  const { stats } = useSelector((state: RootState) => state.compliance)

  const complianceRate = stats.totalScans > 0 ? Math.round((stats.compliantProducts / stats.totalScans) * 100) : 0

  const metricCards = [
    {
      title: "Total Scans",
      value: stats.totalScans.toString(),
      icon: FileText,
      color: "text-gov-blue",
      bgColor: "bg-gov-blue/10",
      borderColor: "border-gov-blue/20",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Compliant Products",
      value: stats.compliantProducts.toString(),
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Violations Detected",
      value: stats.violationsDetected.toString(),
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      trend: "-5%",
      trendUp: false
    },
    {
      title: "Critical Issues",
      value: stats.criticalIssues.toString(),
      icon: Target,
      color: "text-error",
      bgColor: "bg-error/10",
      borderColor: "border-error/20",
      trend: "-15%",
      trendUp: false
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Compliance Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Monitor product compliance and system analytics in real-time</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-center">
              System Operational
            </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Compliance Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Compliance Overview</h3>
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          
          {/* Circular Progress */}
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32">
                <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="8"
                    strokeDasharray="351.86"
                    strokeDashoffset={351.86 - (351.86 * complianceRate) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{complianceRate}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Compliant</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="text-center p-3 bg-green-50 rounded-lg sm:rounded-xl">
              <p className="text-base sm:text-lg font-semibold text-green-700">{stats.compliantProducts}</p>
              <p className="text-xs sm:text-sm text-green-600">Compliant</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg sm:rounded-xl">
              <p className="text-base sm:text-lg font-semibold text-red-700">{stats.violationsDetected}</p>
              <p className="text-xs sm:text-sm text-red-600">Violations</p>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'scan', message: 'Product label scanned successfully', time: '2 min ago', status: 'success' },
              { type: 'violation', message: 'Missing MRP declaration detected', time: '5 min ago', status: 'warning' },
              { type: 'compliance', message: 'Compliance check completed', time: '12 min ago', status: 'success' },
              { type: 'critical', message: 'Critical violation flagged for review', time: '25 min ago', status: 'error' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                } animate-pulse`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
