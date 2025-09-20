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
      console.log('🎥 Starting camera initialization...', {
        hasNavigator: !!navigator,
        hasMediaDevices: !!navigator?.mediaDevices,
        hasGetUserMedia: !!navigator?.mediaDevices?.getUserMedia,
        userAgent: navigator?.userAgent
      })
      
      // Enhanced browser compatibility check
      if (!navigator) {
        throw new Error('Navigator not available - browser may be too old')
      }
      
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices not supported - please use HTTPS or a modern browser')
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported - browser may be too old')
      }

      console.log('🎥 Browser compatibility check passed')
      
      // Check for available devices first
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        console.log('🎥 Available video devices:', videoDevices.length, videoDevices.map(d => ({ deviceId: d.deviceId, label: d.label || 'Unknown' })))
        
        if (videoDevices.length === 0) {
          throw new Error('No camera devices found on this device')
        }
      } catch (deviceError) {
        console.warn('🎥 ⚠️ Could not enumerate devices (may still work):', deviceError)
      }

      console.log('🎥 Requesting camera permissions...')
      
      let mediaStream: MediaStream

      // Progressive constraints for better compatibility
      const constraintOptions = [
        // Best quality with rear camera preference
        {
          video: {
            width: { ideal: width, min: 320, max: 1920 },
            height: { ideal: height, min: 240, max: 1080 },
            facingMode: { ideal: facingMode },
            frameRate: { ideal: 30, min: 10, max: 60 }
          }
        },
        // Fallback without facingMode (for devices without rear camera)
        {
          video: {
            width: { ideal: 1280, min: 320, max: 1920 },
            height: { ideal: 720, min: 240, max: 1080 },
            frameRate: { ideal: 30, min: 10, max: 60 }
          }
        },
        // Basic HD constraints
        {
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 }
          }
        },
        // Standard resolution
        {
          video: {
            width: { ideal: 640, min: 320 },
            height: { ideal: 480, min: 240 }
          }
        },
        // Minimal constraints (last resort)
        { video: true }
      ]

      let lastError: any = null
      let attemptSuccess = false

      for (let i = 0; i < constraintOptions.length; i++) {
        try {
          console.log(`🎥 Attempt ${i + 1}/${constraintOptions.length}:`, JSON.stringify(constraintOptions[i], null, 2))
          
          // Add timeout to prevent hanging
          const streamPromise = navigator.mediaDevices.getUserMedia(constraintOptions[i])
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Camera request timeout - please try again')), 10000)
          )
          
          mediaStream = await Promise.race([streamPromise, timeoutPromise]) as MediaStream
          console.log('🎥 ✅ Camera started successfully with constraints:', constraintOptions[i])
          attemptSuccess = true
          break
        } catch (attemptError: any) {
          console.warn(`🎥 ⚠️ Attempt ${i + 1} failed:`, {
            name: attemptError.name,
            message: attemptError.message,
            constraint: constraintOptions[i]
          })
          lastError = attemptError
          
          // Don't continue if it's a permission error
          if (attemptError.name === 'NotAllowedError' || attemptError.name === 'PermissionDeniedError') {
            console.error('🎥 ❌ Permission denied, stopping attempts')
            break
          }
        }
      }
      
      if (!attemptSuccess || !mediaStream!) {
        throw lastError || new Error('All camera initialization attempts failed')
      }

      console.log('🎥 MediaStream obtained:', {
        id: mediaStream.id,
        active: mediaStream.active,
        tracks: mediaStream.getVideoTracks().map(t => ({ 
          label: t.label || 'Unknown Camera', 
          enabled: t.enabled, 
          readyState: t.readyState,
          constraints: t.getConstraints()
        }))
      })
      
      setStream(mediaStream)
      setIsOpen(true)
      
      // Wait for video element to be available with retries
      let videoElement = videoRef.current
      let retries = 0
      const maxRetries = 10
      
      while (!videoElement && retries < maxRetries) {
        console.log(`🎥 Waiting for video element... attempt ${retries + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 100))
        videoElement = videoRef.current
        retries++
      }
      
      if (!videoElement) {
        console.warn('🎥 ⚠️ Video element not available after retries, but continuing...')
        setIsLoading(false)
        return
      }
      
      // Enhanced video setup with better error handling
      if (videoElement) {
        const video = videoElement
        console.log('🎥 Setting up video element...')
        
        // Clear any previous source
        video.srcObject = null
        
        // Set new stream
        video.srcObject = mediaStream
        video.muted = true // Prevent audio feedback
        video.playsInline = true // Important for mobile
        video.autoplay = true
        
        // Enhanced video loading with multiple event handlers
        const setupVideoPlayback = () => {
          return new Promise<void>((resolve, reject) => {
            const cleanup = () => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata)
              video.removeEventListener('canplay', onCanPlay)
              video.removeEventListener('playing', onPlaying)
              video.removeEventListener('error', onError)
              clearTimeout(timeout)
            }
            
            const timeout = setTimeout(() => {
              console.warn('🎥 ⚠️ Video setup timeout - continuing anyway')
              cleanup()
              resolve()
            }, 8000)
            
            const onLoadedMetadata = () => {
              console.log('🎥 ✅ Video metadata loaded:', {
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                duration: video.duration
              })
            }
            
            const onCanPlay = () => {
              console.log('🎥 ✅ Video can play')
            }
            
            const onPlaying = () => {
              console.log('🎥 ✅ Video is playing')
              cleanup()
              resolve()
            }
            
            const onError = (e: Event) => {
              console.error('🎥 ❌ Video error:', e)
              cleanup()
              reject(new Error('Video playback failed'))
            }
            
            video.addEventListener('loadedmetadata', onLoadedMetadata)
            video.addEventListener('canplay', onCanPlay)
            video.addEventListener('playing', onPlaying)
            video.addEventListener('error', onError)
          })
        }
        
        // Start video playback
        try {
          await video.play()
          console.log('🎥 Video play() called successfully')
          
          // Wait for actual playback
          await setupVideoPlayback()
          console.log('🎥 ✅ Video fully loaded and playing')
          
          // Final delay to ensure video is displaying
          setTimeout(() => {
            console.log('🎥 ✅ Camera setup complete, removing loading state')
            setIsLoading(false)
          }, 1000)
        } catch (playError) {
          console.error('🎥 ❌ Video play failed:', playError)
          // Still remove loading state
          setIsLoading(false)
        }
      } else {
        console.warn('🎥 ⚠️ No video element available after retries')
        setIsLoading(false)
      }
      
      console.log('🎥 ✅ Camera initialization complete')
    } catch (err: any) {
      console.error('🎥 ❌ Camera initialization failed:', {
        name: err?.name,
        message: err?.message,
        stack: err?.stack
      })
      setIsLoading(false)
      
      let errorMessage = 'Camera access failed. '
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = '🚫 Camera permission denied.\n\nPlease:\n• Click "Allow" when prompted for camera access\n• Check browser settings to enable camera\n• Ensure no other app is using the camera\n• Try refreshing the page'
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = '📷 No camera found.\n\nPlease:\n• Connect a camera to your device\n• Check if camera drivers are installed\n• Ensure camera is not disabled in system settings\n• Try refreshing the page'
        } else if (err.name === 'NotSupportedError') {
          errorMessage = '🌐 Camera not supported.\n\nPlease:\n• Use Chrome, Firefox, or Safari\n• Ensure you\'re on HTTPS (camera requires secure connection)\n• Update your browser to the latest version'
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = '⚠️ Camera is busy.\n\nPlease:\n• Close other apps or browser tabs using the camera\n• Restart your browser\n• Check if video conferencing apps are running'
        } else if (err.message.includes('timeout')) {
          errorMessage = '⏱️ Camera request timed out.\n\nPlease:\n• Check your camera connection\n• Try again in a few seconds\n• Restart your browser if the issue persists'
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