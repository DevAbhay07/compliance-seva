import React from 'react'
import { X, ScanLine, Camera as CameraIcon, Loader2 } from 'lucide-react'

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
}

const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  videoRef,
  error,
  isLoading = false,
  onCapture,
  onClose,
  onDownload,
  title = "Camera Scanner",
  description = "Capture product labels for compliance analysis"
}) => {
  if (!isOpen) return null

  console.log('📱 CameraModal render - isLoading:', isLoading, 'error:', error)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Camera Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 touch-manipulation"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Camera View */}
        <div className="p-3 sm:p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CameraIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Camera Error</h4>
              <p className="text-red-700 mb-4 text-sm sm:text-base whitespace-pre-line">{error}</p>
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 touch-manipulation"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-cover"
                />
                
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-sm">Starting camera...</p>
                  </div>
                )}
                
                {/* Camera Overlay */}
                {!isLoading && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Scanning grid */}
                    <div className="absolute inset-4 sm:inset-8 border-2 border-white/50 rounded-lg">
                      <div className="absolute top-0 left-1/2 w-px h-full bg-white/30 transform -translate-x-1/2"></div>
                      <div className="absolute left-0 top-1/2 w-full h-px bg-white/30 transform -translate-y-1/2"></div>
                    </div>
                    
                    {/* Corner indicators */}
                    <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-t-2 border-white"></div>
                    <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-t-2 border-white"></div>
                    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-b-2 border-white"></div>
                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-b-2 border-white"></div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 px-2">
                      <div className="bg-black/70 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm">
                        Position product label within the frame
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                <button
                  onClick={onCapture}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ScanLine className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {isLoading ? 'Preparing...' : 'Capture & Analyze'}
                  </span>
                </button>
                
                {onDownload && (
                  <button
                    onClick={onDownload}
                    disabled={isLoading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Download Photo
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation text-sm sm:text-base"
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