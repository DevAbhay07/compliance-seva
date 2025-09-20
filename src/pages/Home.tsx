import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ScanLine, 
  BarChart3, 
  Shield, 
  FileCheck, 
  Zap, 
  Target, 
  CheckCircle,
  ArrowRight,
  Camera,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import { useCamera } from '../hooks/useCamera'
import CameraModal from '../components/CameraModal'
import CameraDebug from '../components/CameraDebug'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState<'camera' | 'gallery' | 'link'>('camera')
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Camera functionality
  const camera = useCamera({ facingMode: 'environment' })

  const handleMethodSelect = (method: 'camera' | 'gallery' | 'link') => {
    setSelectedMethod(method)
    setUrlInput('') // Clear URL input when switching methods
  }

  const handleStartScan = async () => {
    console.log('🏠 handleStartScan called with method:', selectedMethod)
    
    if (selectedMethod === 'camera') {
      // Start camera directly on home page
      console.log('🏠 Starting camera from Home page')
      try {
        await camera.startCamera()
        console.log('🏠 ✅ Camera started successfully')
      } catch (error) {
        console.error('🏠 ❌ Camera failed to start:', error)
      }
    } else if (selectedMethod === 'gallery') {
      // Trigger file input
      console.log('🏠 Triggering file input')
      fileInputRef.current?.click()
    } else if (selectedMethod === 'link' && urlInput.trim()) {
      // Navigate to scanner with URL
      console.log('🏠 Navigating to scanner with URL:', urlInput)
      navigate('/scanner', { state: { initialMethod: 'url', url: urlInput } })
    } else {
      console.warn('🏠 Invalid scan conditions:', { selectedMethod, urlInput: urlInput.trim() })
    }
  }

  const handleCameraCapture = async () => {
    const photoBlob = await camera.capturePhoto()
    if (photoBlob) {
      // Close camera and navigate to scanner with photo
      camera.stopCamera()
      navigate('/scanner', { state: { initialMethod: 'camera', photoBlob } })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Navigate to scanner with uploaded file
      navigate('/scanner', { state: { initialMethod: 'upload', file } })
    }
  }

  const handleCameraDebug = async () => {
    console.log('🏠 Debug: Starting camera from Home page')
    try {
      await camera.startCamera()
    } catch (error) {
      console.error('🏠 Debug: Camera failed:', error)
    }
  }

  const handleCheckCameraSupport = async () => {
    const isSupported = await camera.checkCameraSupport()
    console.log('🏠 Camera support check:', isSupported)
    alert(`Camera support: ${isSupported ? 'Supported ✅' : 'Not supported ❌'}`)
  }
  const features = [
    {
      icon: ScanLine,
      title: "AI-Powered Label Scanning",
      description: "Advanced OCR and machine learning to automatically detect compliance violations in product labels.",
      color: "text-gov-blue"
    },
    {
      icon: BarChart3,
      title: "Monitor Trends with Analytics",
      description: "Comprehensive dashboards and reports to track compliance patterns and enforcement metrics.",
      color: "text-success"
    },
    {
      icon: Shield,
      title: "Government-Grade Security",
      description: "Built following UX4G standards with enterprise-level security for official government use.",
      color: "text-warning"
    }
  ]

  const scanMethods = [
    {
      icon: Camera,
      title: "Camera Capture",
      description: "Real-time scanning using device camera"
    },
    {
      icon: Upload,
      title: "Gallery Upload",
      description: "Upload images from device gallery"
    },
    {
      icon: LinkIcon,
      title: "URL Scanner",
      description: "Scan products from e-commerce URLs"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Gemini Inspired */}
      <section className="relative bg-gradient-to-br from-gov-blue via-gov-blue-light to-gov-blue bg-opacity-95 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance leading-tight animate-fade-slide-up">
              Streamline Compliance Checks
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 text-balance max-w-3xl mx-auto animate-fade-slide-up">
              Government-grade AI-powered application for validating product labeling compliance with Legal Metrology Rules 2011
            </p>
            
            {/* Interactive CTA Component - Like Reference Image */}
            <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 animate-fade-slide-up-delay max-w-2xl mx-auto">
              
              {/* Method Selection Pills */}
              <div className="flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-full shadow-lg border border-white/20 p-1 w-full sm:w-auto">
                <button
                  onClick={() => handleMethodSelect('camera')}
                  className={`px-4 sm:px-6 py-3 rounded-xl sm:rounded-full text-sm font-medium transition-all duration-300 w-full sm:w-auto touch-manipulation ${
                    selectedMethod === 'camera'
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Camera
                </button>
                <button
                  onClick={() => handleMethodSelect('gallery')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedMethod === 'gallery'
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => handleMethodSelect('link')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedMethod === 'link'
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Link
                </button>
              </div>

              {/* Input Area Based on Selected Method */}
              <div className="w-full max-w-lg">
                {selectedMethod === 'camera' && (
                  <div className="text-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                      <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-700 mb-4">Click to start camera scanning</p>
                      <button
                        onClick={handleStartScan}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
                      >
                        Start Camera <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'gallery' && (
                  <div className="text-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                      <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-700 mb-4">Upload images from your device</p>
                      <button
                        onClick={handleStartScan}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
                      >
                        Choose Files <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'link' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-1">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste URL or type to scan..."
                        className="w-full px-4 py-3 bg-transparent text-gray-700 placeholder-gray-500 outline-none rounded-lg text-sm"
                      />
                    </div>
                    <button
                      onClick={handleStartScan}
                      disabled={!urlInput.trim()}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              
              {/* Secondary Dashboard Button */}
              <Link
                to="/dashboard"
                className="btn-outline border-white/30 text-white hover:bg-white/10 px-6 py-3 text-sm"
              >
                View Dashboard
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-sm text-white/80">Products Scanned</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-sm text-white/80">Accuracy Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm text-white/80">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Compliance Officers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for government officers to ensure Legal Metrology compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="gov-card group hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gray-50 ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple ways to scan and verify product compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scanMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-gov-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600">
                    {method.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-gray-700 font-medium">Instant AI analysis and compliance report generation</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gov-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Compliance Checking?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join government officers across India in ensuring Legal Metrology compliance with our AI-powered scanning solution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scanner"
                className="btn-primary bg-white text-gov-blue hover:bg-gray-100 px-8 py-4 text-lg inline-flex items-center space-x-2"
              >
                <ScanLine className="w-5 h-5" />
                <span>Begin Scanning</span>
              </Link>
              
              <Link
                to="/dashboard"
                className="btn-outline px-8 py-4 text-lg"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Camera Modal */}
      <CameraModal
        isOpen={camera.isOpen}
        videoRef={camera.videoRef}
        error={camera.error}
        isLoading={camera.isLoading}
        onCapture={handleCameraCapture}
        onClose={() => camera.stopCamera()}
        onDownload={camera.downloadPhoto}
        onRetry={camera.retryCamera}
        title="Product Label Scanner"
        description="Position the product label clearly in the frame and capture"
      />

      {/* Debug Component (remove in production) */}
      <CameraDebug
        onStartCamera={handleCameraDebug}
        onCheckSupport={handleCheckCameraSupport}
      />
    </div>
  )
}

export default Home