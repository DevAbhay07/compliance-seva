import React, { useEffect } from 'react'
import { X, ScanLine, Camera as CameraIcon, Loader2, RefreshCw } from 'lucide-react'

interface CameraModalProps {
  isOpen: boolean
  videoRef: React.RefObject<HTMLVideoElement>
  error: string | null
  isLoading?: boolean
  onCapture: () => void
  onClose: () => void
  onDownload?: () => void
  title?: string
  description?: string
  onRetry?: () => void
}

const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  videoRef,
  error,
  isLoading = false,
  onCapture,
  onClose,
  onDownload,
  title = "Product Label Scanner",
  description = "Position the product label clearly in the frame and capture",
  onRetry
}) => {
  if (!isOpen) return null

  console.log('📱 CameraModal render - isLoading:', isLoading, 'error:', error)

  // Handle video loaded data
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {
        console.log('📱 Video loaded and ready to play')
      }
      
      video.addEventListener('loadeddata', handleLoadedData)
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [videoRef])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden">
        {/* Modern Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <CameraIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 touch-manipulation hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Square Camera View */}
        <div className="p-4 sm:p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CameraIcon className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-red-900 mb-2">Camera Access Required</h4>
              <p className="text-red-700 mb-6 text-sm leading-relaxed">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 touch-manipulation"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 touch-manipulation"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Modern Square Camera Container */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Square aspect ratio container */}
                <div className="aspect-square relative">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                    onLoadedData={() => console.log('📱 Video loaded')}
                    onCanPlay={() => console.log('📱 Video can play')}
                  />
                  
                  {/* Enhanced Loading State */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-purple-900/90 flex flex-col items-center justify-center text-white">
                      <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-2">Initializing Camera</h4>
                        <p className="text-sm text-white/80">Please wait while we access your camera...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Modern Camera Overlay */}
                  {!isLoading && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Central focus area */}
                      <div className="absolute inset-8 sm:inset-12">
                        {/* Main scanning frame */}
                        <div className="relative w-full h-full border-2 border-white/60 rounded-2xl">
                          {/* Corner accents */}
                          <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-purple-400 rounded-tl-xl"></div>
                          <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-purple-400 rounded-tr-xl"></div>
                          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-xl"></div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-purple-400 rounded-br-xl"></div>
                          
                          {/* Center crosshair */}
                          <div className="absolute top-1/2 left-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-400 transform -translate-y-1/2"></div>
                            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-purple-400 transform -translate-x-1/2"></div>
                          </div>
                          
                          {/* Scanning line animation */}
                          <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Instructions overlay */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                          📷 Position product label within the frame
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modern Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                <button
                  onClick={onCapture}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl w-full sm:w-auto touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ScanLine className="w-4 h-4" />
                  </div>
                  <span className="text-base">
                    {isLoading ? 'Preparing Camera...' : 'Capture & Analyze'}
                  </span>
                </button>
                
                {onDownload && (
                  <button
                    onClick={onDownload}
                    disabled={isLoading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto touch-manipulation text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    📥 Download Photo
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation text-base border border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CameraModal