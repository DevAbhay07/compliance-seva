import React from 'react'
import { Camera, RefreshCw, HelpCircle } from 'lucide-react'

interface CameraDebugProps {
  onStartCamera: () => void
  onCheckSupport: () => void
}

const CameraDebug: React.FC<CameraDebugProps> = ({ onStartCamera, onCheckSupport }) => {
  const handleCameraTest = async () => {
    console.log('🔧 CAMERA REFRESH TEST STARTED')
    console.log('🔧 Navigator:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia
    })
    
    if (navigator.mediaDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        console.log('🔧 Available devices:', devices.map(d => ({
          kind: d.kind,
          deviceId: d.deviceId,
          label: d.label || 'Unknown',
          groupId: d.groupId
        })))
      } catch (e) {
        console.error('🔧 Device enumeration failed:', e)
      }
      
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName })
        console.log('🔧 Camera permission status:', permissions.state)
      } catch (e) {
        console.log('🔧 Could not check camera permissions:', e)
      }
    }
    
    console.log('🔧 Starting camera refresh...')
    onStartCamera()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      <button
        onClick={handleCameraTest}
        className="bg-gov-blue hover:bg-gov-blue-light text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 group"
        title="Refresh Camera"
      >
        <RefreshCw className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block group-hover:block">Refresh Camera</span>
      </button>
      
      <button
        onClick={onCheckSupport}
        className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 group"
        title="Support"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block group-hover:block">Support</span>
      </button>
    </div>
  )
}

export default CameraDebug