import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { RootState } from '../lib/store'
import { deleteRecord } from '../lib/slices/complianceSlice'
import { formatDate } from '../lib/utils'

const Records: React.FC = () => {
  const dispatch = useDispatch()
  const { records } = useSelector((state: RootState) => state.compliance)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredRecords = records
    .filter(record => {
      const matchesSearch = record.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.scanDate)
      const dateB = new Date(b.scanDate)
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case 'violations':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'critical':
        return <XCircle className="w-5 h-5 text-error" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-success bg-success/10 border-success/20'
      case 'violations':
        return 'text-warning bg-warning/10 border-warning/20'
      case 'critical':
        return 'text-error bg-error/10 border-error/20'
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Compliant'
      case 'violations':
        return 'Violations'
      case 'critical':
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  const handleDeleteRecord = (recordId: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteRecord(recordId))
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Compliance Records</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">History of scanned labels and compliance reports</p>
        </div>
        <button className="btn-primary flex items-center justify-center space-x-2 touch-manipulation">
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="gov-card">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gov-input pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="gov-input"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="violations">Violations</option>
              <option value="critical">Critical</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary flex items-center justify-center space-x-2 touch-manipulation"
            >
              {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              <span>Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Records Count */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0 text-sm text-gray-600">
        <span>Showing {filteredRecords.length} of {records.length} records</span>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Records Table/Cards */}
      <div className="gov-card overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Violations
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-8 h-8 text-gray-300 mb-2" />
                      <span>No records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{record.productName}</div>
                        <div className="text-sm text-gray-500">ID: {record.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span>{getStatusText(record.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-semibold text-gray-900">{record.complianceScore}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              record.complianceScore >= 90
                                ? 'bg-success'
                                : record.complianceScore >= 70
                                ? 'bg-warning'
                                : 'bg-error'
                            }`}
                            style={{ width: `${record.complianceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {formatDate(record.scanDate)}
                    </td>
                    <td className="px-6 py-4">
                      {record.violations.length > 0 ? (
                        <div className="text-sm">
                          <span className="font-medium text-warning">{record.violations.length}</span>
                          <span className="text-gray-500 ml-1">violation{record.violations.length !== 1 ? 's' : ''}</span>
                        </div>
                      ) : (
                        <span className="text-success text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-2 text-gray-400 hover:text-gov-blue hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 text-gray-400 hover:text-error hover:bg-red-50 rounded transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredRecords.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <Search className="w-8 h-8 text-gray-300 mb-2" />
                <span>No records found</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-2">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{record.productName}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {record.id}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 text-gray-400 hover:text-gov-blue hover:bg-gray-100 rounded transition-colors touch-manipulation"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-2 text-gray-400 hover:text-error hover:bg-red-50 rounded transition-colors touch-manipulation"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Status and Score */}
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span>{getStatusText(record.status)}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-semibold text-gray-900">{record.complianceScore}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            record.complianceScore >= 90
                              ? 'bg-success'
                              : record.complianceScore >= 70
                              ? 'bg-warning'
                              : 'bg-error'
                          }`}
                          style={{ width: `${record.complianceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Date and Violations */}
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-1 xs:space-y-0 text-xs">
                    <span className="text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(record.scanDate)}
                    </span>
                    <div>
                      {record.violations.length > 0 ? (
                        <span className="text-warning font-medium">
                          {record.violations.length} violation{record.violations.length !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-success">No violations</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-2xl sm:w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Record Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                    <div className="flex flex-col xs:flex-row xs:items-center">
                      <span className="text-gray-600 text-sm xs:text-base">Product Name:</span>
                      <span className="ml-0 xs:ml-2 font-medium text-sm xs:text-base">{selectedRecord.productName}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center">
                      <span className="text-gray-600 text-sm xs:text-base">Scan Date:</span>
                      <span className="ml-0 xs:ml-2 font-medium text-sm xs:text-base">{formatDate(selectedRecord.scanDate)}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center">
                      <span className="text-gray-600 text-sm xs:text-base">Compliance Score:</span>
                      <span className="ml-0 xs:ml-2 font-medium text-gov-blue text-sm xs:text-base">{selectedRecord.complianceScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Compliance Status</h3>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedRecord.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusText(selectedRecord.status)}
                    </span>
                  </div>
                </div>

                {/* Violations */}
                {selectedRecord.violations.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Violations</h3>
                    <ul className="space-y-2">
                      {selectedRecord.violations.map((violation, index) => (
                        <li key={index} className="flex items-start space-x-2 p-2 bg-warning/10 rounded">
                          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{violation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 pt-4 border-t">
                  <button className="flex-1 btn-primary touch-manipulation">
                    Generate Report
                  </button>
                  <button className="flex-1 btn-secondary touch-manipulation">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Records