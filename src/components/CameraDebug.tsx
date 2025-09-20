import React from 'react'
import { Camera, Bug } from 'lucide-react'

interface CameraDebugProps {
  onStartCamera: () => void
  onCheckSupport: () => void
}

const CameraDebug: React.FC<CameraDebugProps> = ({ onStartCamera, onCheckSupport }) => {
  const handleCameraTest = async () => {
    console.log('🔧 CAMERA DEBUG TEST STARTED')
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
    
    console.log('🔧 Starting camera test...')
    onStartCamera()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <button
        onClick={handleCameraTest}
        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
        title="Debug Camera"
      >
        <Bug className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block">Debug Camera</span>
      </button>
      
      <button
        onClick={onCheckSupport}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
        title="Check Camera Support"
      >
        <Camera className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block">Check Support</span>
      </button>
    </div>
  )
}

export default CameraDebug