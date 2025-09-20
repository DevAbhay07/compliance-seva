import { useState, useRef, useEffect, useCallback } from 'react'

interface CameraOptions {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'
}

export const useCamera = (options: CameraOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { width = 1280, height = 720, facingMode = 'environment' } = options

  // Check camera permissions and availability
  const checkCameraSupport = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false
      }
      
      // Check for available devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      return videoDevices.length > 0
    } catch {
      return false
    }
  }

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      console.log('🎥 Starting camera initialization...')
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this browser. Please use Chrome, Firefox, or Safari.')
      }

      console.log('🎥 Requesting camera permissions...')
      
      let mediaStream: MediaStream

      // Try progressive constraints for better compatibility
      const constraintOptions = [
        // Best quality with rear camera preference
        {
          video: {
            width: { ideal: width, min: 320 },
            height: { ideal: height, min: 240 },
            facingMode: { ideal: facingMode },
            frameRate: { ideal: 30, min: 15 }
          }
        },
        // Fallback without facingMode
        {
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 },
            frameRate: { ideal: 30, min: 15 }
          }
        },
        // Basic constraints
        {
          video: {
            width: { ideal: 640, min: 320 },
            height: { ideal: 480, min: 240 }
          }
        },
        // Minimal constraints
        { video: true }
      ]

      let lastError: any = null

      for (let i = 0; i < constraintOptions.length; i++) {
        try {
          console.log(`🎥 Attempt ${i + 1}/${constraintOptions.length}:`, constraintOptions[i])
          mediaStream = await navigator.mediaDevices.getUserMedia(constraintOptions[i])
          console.log('🎥 ✅ Camera started successfully with constraints:', constraintOptions[i])
          break
        } catch (attemptError) {
          console.warn(`🎥 ⚠️ Attempt ${i + 1} failed:`, attemptError)
          lastError = attemptError
          if (i === constraintOptions.length - 1) {
            throw attemptError
          }
        }
      }
      
      if (!mediaStream!) {
        throw lastError || new Error('Failed to get media stream')
      }

      console.log('🎥 MediaStream obtained:', mediaStream)
      console.log('🎥 Video tracks:', mediaStream.getVideoTracks().map(t => ({ 
        label: t.label, 
        enabled: t.enabled, 
        readyState: t.readyState 
      })))
      
      setStream(mediaStream)
      setIsOpen(true)
      
      // Enhanced video setup
      if (videoRef.current) {
        const video = videoRef.current
        console.log('🎥 Setting up video element...')
        
        // Set stream
        video.srcObject = mediaStream
        
        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn('🎥 ⚠️ Video metadata load timeout')
            resolve() // Don't reject, continue anyway
          }, 5000)
          
          const onLoadedMetadata = () => {
            clearTimeout(timeout)
            console.log('🎥 ✅ Video metadata loaded:', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              duration: video.duration
            })
            resolve()
          }
          
          const onError = (e: any) => {
            clearTimeout(timeout)
            console.error('🎥 ❌ Video metadata error:', e)
            resolve() // Don't reject, continue anyway
          }
          
          video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
          video.addEventListener('error', onError, { once: true })
        })
        
        // Start playback
        try {
          await video.play()
          console.log('🎥 ✅ Video playing successfully')
          
          // Small delay to ensure video is actually displaying
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        } catch (playError) {
          console.warn('🎥 ⚠️ Video play failed:', playError)
          setIsLoading(false)
        }
      } else {
        console.warn('🎥 ⚠️ No video ref available')
        setIsLoading(false)
      }
      
      console.log('🎥 ✅ Camera initialization complete')
    } catch (err) {
      console.error('🎥 ❌ Camera error:', err)
      setIsLoading(false)
      
      let errorMessage = 'Camera access failed. '
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = '🚫 Camera permission denied.\n\nPlease:\n• Allow camera access in your browser\n• Check camera permissions in browser settings\n• Ensure no other app is using the camera'
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = '📷 No camera found.\n\nPlease:\n• Connect a camera to your device\n• Check if camera drivers are installed\n• Try refreshing the page'
        } else if (err.name === 'NotSupportedError') {
          errorMessage = '🌐 Camera not supported.\n\nPlease:\n• Use Chrome, Firefox, or Safari\n• Ensure you\'re on HTTPS (required for camera)\n• Try a different browser'
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = '⚠️ Camera is busy.\n\nPlease:\n• Close other apps using the camera\n• Restart your browser\n• Check if camera is being used elsewhere'
        } else {
          errorMessage = `❌ ${err.message}\n\nPlease:\n• Refresh the page and try again\n• Check your camera settings\n• Ensure camera permissions are allowed`
        }
      } else {
        errorMessage = '❓ Unknown camera error.\n\nPlease:\n• Refresh the page\n• Check camera permissions\n• Try a different browser'
      }
      
      setError(errorMessage)
    }
  }, [width, height, facingMode])

  const retryCamera = useCallback(() => {
    // Stop current stream if any
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    // Clear error and try again
    setError(null)
    startCamera()
  }, [stream, startCamera])

  const stopCamera = () => {
    console.log('🎥 Stopping camera...')
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log(`🎥 Stopping track: ${track.label}`)
        track.stop()
      })
      setStream(null)
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsOpen(false)
    setError(null)
    setIsLoading(false)
  }

  const capturePhoto = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (videoRef.current && stream) {
        console.log('🎥 Capturing photo...')
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        // Set canvas size to video dimensions
        canvas.width = video.videoWidth || video.clientWidth
        canvas.height = video.videoHeight || video.clientHeight
        
        console.log('🎥 Canvas dimensions:', { width: canvas.width, height: canvas.height })
        
        if (context && canvas.width > 0 && canvas.height > 0) {
          // Draw the video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convert to blob with high quality
          canvas.toBlob((blob) => {
            console.log('🎥 ✅ Photo captured:', blob?.size, 'bytes')
            resolve(blob)
          }, 'image/jpeg', 0.9)
        } else {
          console.error('🎥 ❌ Failed to capture photo - invalid canvas')
          resolve(null)
        }
      } else {
        console.error('🎥 ❌ Failed to capture photo - no video or stream')
        resolve(null)
      }
    })
  }

  const downloadPhoto = async () => {
    const blob = await capturePhoto()
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance-scan-${new Date().getTime()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log('🎥 ✅ Photo downloaded')
    } else {
      console.error('🎥 ❌ Failed to download photo')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        console.log('🎥 Cleanup: stopping camera on unmount')
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return {
    isOpen,
    stream,
    error,
    isLoading,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    downloadPhoto,
    checkCameraSupport,
    retryCamera
  }
}