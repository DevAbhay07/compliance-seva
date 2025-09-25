import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  ScanLine, 
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
  X
} from 'lucide-react'
import { startScan, completeScan } from '../lib/slices/complianceSlice'
import { generateId } from '../lib/utils'
import { useCamera } from '../hooks/useCamera'
import CameraModal from '../components/CameraModal'

const Scanner: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [activeMethod, setActiveMethod] = useState<'camera' | 'upload' | 'url' | null>(null)
  const [urlInput, setUrlInput] = useState('')
  
  // Camera functionality
  const camera = useCamera({ facingMode: 'environment' })

  // Handle initial method and data from navigation
  useEffect(() => {
    const state = location.state as { 
      initialMethod?: 'camera' | 'upload' | 'url'; 
      url?: string; 
      file?: File 
    }
    
    if (state?.initialMethod) {
      setActiveMethod(state.initialMethod)
      
      if (state.initialMethod === 'url' && state.url) {
        setUrlInput(state.url)
        // Auto-start scanning for URL
        handleScan('url')
      } else if (state.initialMethod === 'upload' && state.file) {
        // Auto-start scanning for uploaded file
        handleScan('upload')
      } else if (state.initialMethod === 'camera') {
        // Auto-start camera scanning
        handleScan('camera')
      }
    }
  }, [location.state])

  const scanMethods = [
    {
      id: 'camera' as const,
      title: 'Camera Capture',
      description: 'Real-time scanning using device camera',
      icon: Camera,
      color: 'text-gov-blue',
      bgColor: 'bg-gov-blue/10',
      borderColor: 'border-gov-blue/20'
    },
    {
      id: 'upload' as const,
      title: 'Gallery Upload',
      description: 'Upload images from device gallery',
      icon: Upload,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      id: 'url' as const,
      title: 'URL Scanner',
      description: 'Scan products from e-commerce URLs',
      icon: LinkIcon,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    }
  ]

  const handleScan = async (method: typeof activeMethod) => {
    console.log('📷 handleScan called with method:', method)
    
    if (method === 'camera') {
      // Start camera for camera method
      console.log('📷 Starting camera from Scanner page')
      try {
        await camera.startCamera()
        console.log('📷 ✅ Camera started successfully from Scanner')
        setActiveMethod(method)
        return
      } catch (error) {
        console.error('📷 ❌ Camera failed to start from Scanner:', error)
        return
      }
    }
    
    // For other methods, proceed with scanning
    console.log('📷 Starting scan process for method:', method)
    setIsScanning(true)
    dispatch(startScan())

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock scan result
    const mockResult = {
      id: generateId(),
      productName: `Sample Product - ${method?.toUpperCase()}`,
      scanDate: new Date().toISOString(),
      status: Math.random() > 0.7 ? 'compliant' : 'violations',
      violations: Math.random() > 0.7 ? [] : ['Missing MRP declaration', 'Incorrect net quantity format'],
      complianceScore: Math.floor(Math.random() * 40) + 60,
      details: {
        mrp: '₹299',
        netQuantity: '500g',
        manufacturer: 'Sample Corp Ltd',
        violations: []
      }
    }

    setScanResult(mockResult)
    dispatch(completeScan(mockResult))
    setIsScanning(false)
  }

  const handleCameraRefresh = async () => {
    console.log('📷 Scanner: Refreshing camera')
    try {
      await camera.startCamera()
      setActiveMethod('camera')
    } catch (error) {
      console.error('📷 Scanner: Camera refresh failed:', error)
    }
  }

  const handleCameraSupport = async () => {
    const isSupported = await camera.checkCameraSupport()
    console.log('📷 Scanner: Camera support check:', isSupported)
    alert(`Camera support: ${isSupported ? 'Supported ✅' : 'Not supported ❌'}`)
  }

  const handleCameraCapture = async () => {
    const photoBlob = await camera.capturePhoto()
    if (photoBlob) {
      // Close camera first
      camera.stopCamera()
      
      // Start analysis
      setIsScanning(true)
      dispatch(startScan())

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock scan result with actual photo data
      const mockResult = {
        id: generateId(),
        productName: 'Captured Product Label',
        scanDate: new Date().toISOString(),
        status: Math.random() > 0.7 ? 'compliant' : 'violations',
        violations: Math.random() > 0.7 ? [] : ['Missing MRP declaration', 'Incorrect net quantity format'],
        complianceScore: Math.floor(Math.random() * 40) + 60,
        details: {
          mrp: '₹299',
          netQuantity: '500g',
          manufacturer: 'Sample Corp Ltd',
          violations: []
        }
      }

      setScanResult(mockResult)
      dispatch(completeScan(mockResult))
      setIsScanning(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleScan('upload')
    }
  }

  const handleUrlScan = () => {
    if (urlInput.trim()) {
      handleScan('url')
      setUrlInput('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-6 h-6 text-success" />
      case 'violations':
        return <AlertTriangle className="w-6 h-6 text-warning" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-success bg-success/10 border-success/20'
      case 'violations':
        return 'text-warning bg-warning/10 border-warning/20'
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Label Scanner</h1>
        <p className="text-gray-600">Select a scanning method to check product compliance</p>
      </div>

      {/* Scanning Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scanMethods.map((method) => {
          const Icon = method.icon
          const isActive = activeMethod === method.id
          
          return (
            <div
              key={method.id}
              className={`gov-card cursor-pointer transition-all duration-200 hover:scale-105 ${
                isActive ? `ring-2 ring-${method.color.replace('text-', '')} ${method.borderColor}` : ''
              }`}
              onClick={(e) => {
                // Don't toggle if clicking inside the active URL input area
                if (method.id === 'url' && isActive && (e.target as HTMLElement).closest('.url-input-area')) {
                  return
                }
                setActiveMethod(isActive ? null : method.id)
              }}
            >
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                
                {isActive && (
                  <div className="animate-fade-in">
                    {method.id === 'camera' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleScan('camera')
                        }}
                        disabled={isScanning}
                        className="btn-primary w-full"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Camera'}
                      </button>
                    )}
                    
                    {method.id === 'upload' && (
                      <label className="btn-primary w-full cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isScanning}
                        />
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                      </label>
                    )}
                    
                    {method.id === 'url' && (
                      <div className="space-y-3 url-input-area" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="Paste or type product URL here..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && urlInput.trim() && !isScanning) {
                                e.preventDefault()
                                handleUrlScan()
                              }
                            }}
                            onFocus={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm bg-white outline-none"
                            disabled={isScanning}
                            autoComplete="url"
                            spellCheck={false}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUrlScan()
                          }}
                          disabled={isScanning || !urlInput.trim()}
                          className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Scanning...</span>
                            </>
                          ) : (
                            <>
                              <LinkIcon className="w-4 h-4" />
                              <span>Scan URL</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <div className="gov-card text-center animate-scale-in">
          <div className="mb-4">
            <ScanLine className="w-12 h-12 text-gov-blue mx-auto animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Image...</h3>
          <p className="text-gray-600 mb-4">AI is analyzing the label for compliance violations</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gov-blue h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResult && !isScanning && (
        <div className="gov-card animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Scan Results</h3>
            <button
              onClick={() => setScanResult(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Product Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">{scanResult.productName}</h4>
                <p className="text-sm text-gray-600">Scanned on {new Date(scanResult.scanDate).toLocaleDateString()}</p>
              </div>
              {getStatusIcon(scanResult.status)}
            </div>

            {/* Compliance Score */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-gov-blue mb-1">{scanResult.complianceScore}%</div>
              <div className="text-sm text-gray-600">Compliance Score</div>
            </div>

            {/* Status Badge */}
            <div className="text-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(scanResult.status)}`}>
                {scanResult.status === 'compliant' ? 'Compliant' : 'Violations Detected'}
              </span>
            </div>

            {/* Violations */}
            {scanResult.violations.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Violations Found:</h5>
                <ul className="space-y-2">
                  {scanResult.violations.map((violation, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                      <span className="text-gray-700">{violation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Details */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Product Details:</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {scanResult.details.mrp && (
                  <div>
                    <span className="text-gray-600">MRP:</span>
                    <span className="ml-2 font-medium">{scanResult.details.mrp}</span>
                  </div>
                )}
                {scanResult.details.netQuantity && (
                  <div>
                    <span className="text-gray-600">Net Quantity:</span>
                    <span className="ml-2 font-medium">{scanResult.details.netQuantity}</span>
                  </div>
                )}
                {scanResult.details.manufacturer && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="ml-2 font-medium">{scanResult.details.manufacturer}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button className="flex-1 btn-primary">
                Generate Report
              </button>
              <button className="flex-1 btn-secondary">
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isScanning && !scanResult && (
        <div className="gov-card bg-gov-blue/5 border-gov-blue/20">
          <div className="text-center">
            <ScanLine className="w-8 h-8 text-gov-blue mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">How to Use</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Select a scanning method above</p>
              <p>• Ensure the product label is clearly visible</p>
              <p>• Wait for AI analysis to complete</p>
              <p>• Review results and take appropriate action</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Camera Modal */}
      <CameraModal
        isOpen={camera.isOpen}
        videoRef={camera.videoRef}
        error={camera.error}
        isLoading={camera.isLoading}
        onCapture={handleCameraCapture}
        onClose={() => {
          camera.stopCamera()
          setActiveMethod(null)
        }}
        onDownload={camera.downloadPhoto}
        onRetry={camera.retryCamera}
        title="Product Label Scanner"
        description="Position the product label clearly in the frame and capture"
      />
    </div>
  )
}

export default Scanner