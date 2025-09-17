import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  User, 
  Lock, 
  Bell, 
  Monitor, 
  Save, 
  Edit,
  Shield,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react'
import { RootState } from '../lib/store'
import { setTheme } from '../lib/slices/uiSlice'

const Settings: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.ui)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: 'Officer Singh',
    email: 'officer.singh@gov.in',
    phone: '+91 98765 43210',
    department: 'Legal Metrology Division',
    designation: 'Senior Inspector',
    location: 'Delhi, India',
    employeeId: 'LM2024001'
  })
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    violationAlerts: true,
    reportReminders: true,
    systemUpdates: true
  })

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information and account details'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      description: 'Password and security settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alert preferences and communication'
    },
    {
      id: 'display',
      label: 'Display',
      icon: Monitor,
      description: 'Theme and interface preferences'
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Simulate saving
    alert('Settings saved successfully!')
  }

  const renderProfileTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gov-blue rounded-full flex items-center justify-center mx-auto sm:mx-0">
          <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{formData.name}</h3>
          <p className="text-gray-600 text-sm sm:text-base">{formData.designation}</p>
          <p className="text-xs sm:text-sm text-gray-500">{formData.department}</p>
        </div>
        <button className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto touch-manipulation">
          <Edit className="w-4 h-4" />
          <span>Edit Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="gov-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
          <input
            type="text"
            value={formData.employeeId}
            className="gov-input bg-gray-50"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="gov-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="gov-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={formData.department}
              className="gov-input pl-10 bg-gray-50"
              disabled
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="gov-input pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="gov-card border-l-4 border-l-warning bg-warning/5">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Security Notice</h4>
            <p className="text-sm text-gray-600 mt-1">
              For security reasons, password changes require verification from your department administrator.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            className="gov-input"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            className="gov-input"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            className="gov-input"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="gov-card bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Password Requirements</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Minimum 8 characters</li>
          <li>• At least one uppercase letter</li>
          <li>• At least one lowercase letter</li>
          <li>• At least one number</li>
          <li>• At least one special character</li>
        </ul>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <p className="text-gray-600">
        Manage how you receive notifications about compliance activities and system updates.
      </p>

      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                {key === 'emailAlerts' && 'Email Alerts'}
                {key === 'smsAlerts' && 'SMS Notifications'}
                {key === 'violationAlerts' && 'Violation Alerts'}
                {key === 'reportReminders' && 'Report Reminders'}
                {key === 'systemUpdates' && 'System Updates'}
              </h4>
              <p className="text-sm text-gray-600">
                {key === 'emailAlerts' && 'Receive notifications via email'}
                {key === 'smsAlerts' && 'Get SMS alerts for critical issues'}
                {key === 'violationAlerts' && 'Instant alerts when violations are detected'}
                {key === 'reportReminders' && 'Reminders for pending reports'}
                {key === 'systemUpdates' && 'Updates about new features and maintenance'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-blue"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <p className="text-gray-600">
        Customize the appearance and behavior of your dashboard.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'light' ? 'border-gov-blue bg-gov-blue/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => dispatch(setTheme('light'))}
            >
              <div className="w-full h-12 bg-white rounded border mb-2"></div>
              <p className="text-sm font-medium text-center">Light</p>
            </div>
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'dark' ? 'border-gov-blue bg-gov-blue/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => dispatch(setTheme('dark'))}
            >
              <div className="w-full h-12 bg-gray-800 rounded border mb-2"></div>
              <p className="text-sm font-medium text-center">Dark</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select className="gov-input">
            <option>English (India)</option>
            <option>हिन्दी (Hindi)</option>
            <option>বাংলা (Bengali)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select className="gov-input">
            <option>IST (UTC +5:30)</option>
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2 overflow-x-auto lg:overflow-visible">
            <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 lg:w-full text-left p-3 rounded-lg transition-all touch-manipulation ${
                      activeTab === tab.id
                        ? 'bg-gov-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="hidden sm:block lg:block">
                        <div className="font-medium text-sm lg:text-base">{tab.label}</div>
                        <div className={`text-xs hidden lg:block ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {tab.description}
                        </div>
                      </div>
                      <div className="sm:hidden lg:hidden">
                        <div className="font-medium text-sm">{tab.label}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="gov-card">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'display' && renderDisplayTab()}

            {/* Save Button */}
            <div className="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto touch-manipulation"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings