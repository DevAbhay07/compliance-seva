import { useState, useRef, useEffect, useCallback } from 'react'

interface CameraOptions {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'
}

// Module-level persistent stream cache for fast re-opens
let cachedStream: MediaStream | null = null
let cachedDeviceId: string | null = null

// Utility function to properly stop a MediaStream
const stopStream = (stream: MediaStream | null) => {
  if (stream) {
    console.log('🎥 Stopping stream tracks:', stream.getTracks().length)
    stream.getTracks().forEach(track => {
      console.log(`🎥 Stopping track: ${track.label || 'Unknown'}`)
      track.stop()
    })
  }
}

// Cleanup function for cached stream
const cleanupCachedStream = () => {
  if (cachedStream) {
    console.log('🎥 Cleaning up cached stream')
    stopStream(cachedStream)
    cachedStream = null
    cachedDeviceId = null
  }
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
    const t0 = performance.now()
    console.log('🎥 Camera start requested', { timestamp: t0 })
    
    try {
      setError(null)
      setIsLoading(true)
      
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

      console.log('🎥 Browser compatibility check passed', { elapsed: performance.now() - t0 })
      
      // Check if we have a cached stream that's still active
      if (cachedStream && cachedStream.active && cachedStream.getVideoTracks().length > 0) {
        console.log('🎥 ⚡ Using cached stream', { elapsed: performance.now() - t0 })
        setStream(cachedStream)
        setIsOpen(true)
        
        // Wait for video element to be available
        let videoElement = videoRef.current
        let retries = 0
        const maxRetries = 10
        
        while (!videoElement && retries < maxRetries) {
          console.log(`🎥 Waiting for video element... attempt ${retries + 1}/${maxRetries}`)
          await new Promise(resolve => setTimeout(resolve, 50)) // Reduced wait time for cached stream
          videoElement = videoRef.current
          retries++
        }
        
        if (videoElement) {
          videoElement.srcObject = cachedStream
          videoElement.muted = true
          videoElement.playsInline = true
          videoElement.autoplay = true
          
          try {
            await videoElement.play()
            console.log('🎥 ⚡ Cached stream playing', { elapsed: performance.now() - t0 })
            setIsLoading(false)
            return
          } catch (playError) {
            console.warn('🎥 ⚠️ Cached stream play failed:', playError)
          }
        }
      }
      
      // No cached stream available, request new one with low-latency constraints
      console.log('🎥 📡 Requesting new camera stream', { elapsed: performance.now() - t0 })
      
      // Fast preview constraints - prioritize speed over quality for initial display
      const fastConstraints = {
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: { ideal: facingMode },
          frameRate: { ideal: 15, min: 10 } // Lower framerate for faster startup
        }
      }
      
      let mediaStream: MediaStream
      
      try {
        console.log('🎥 getUserMedia start (fast)', { elapsed: performance.now() - t0 })
        mediaStream = await navigator.mediaDevices.getUserMedia(fastConstraints)
        console.log('🎥 getUserMedia end (fast)', { 
          elapsed: performance.now() - t0,
          tracks: mediaStream.getVideoTracks().length 
        })
      } catch (fastError) {
        console.warn('🎥 ⚠️ Fast constraints failed, trying fallback:', fastError)
        // Fallback to basic constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        console.log('🎥 getUserMedia end (fallback)', { elapsed: performance.now() - t0 })
      }

      // Cache the stream for future use
      cachedStream = mediaStream
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        cachedDeviceId = videoTrack.getSettings().deviceId || null
      }
      
      console.log('🎥 MediaStream obtained and cached:', {
        elapsed: performance.now() - t0,
        id: mediaStream.id,
        active: mediaStream.active,
        tracks: mediaStream.getVideoTracks().map(t => ({ 
          label: t.label || 'Unknown Camera', 
          enabled: t.enabled, 
          readyState: t.readyState
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
      
      // Attach stream immediately for faster perceived performance
      const video = videoElement
      console.log('🎥 Setting up video element...', { elapsed: performance.now() - t0 })
      
      // Clear any previous source
      video.srcObject = null
      
      // Set new stream immediately
      video.srcObject = mediaStream
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      
      // Start video playback
      try {
        console.log('🎥 Starting video.play()', { elapsed: performance.now() - t0 })
        await video.play()
        console.log('🎥 ✅ Video.play() resolved', { elapsed: performance.now() - t0 })
        
        // Wait briefly for stable playback
        setTimeout(() => {
          console.log('🎥 ✅ Camera setup complete', { elapsed: performance.now() - t0 })
          setIsLoading(false)
          
          // Optional: Start background upgrade to high-res for better capture quality
          upgradeToHighResInBackground(mediaStream, t0)
        }, 200) // Minimal delay for stability
        
      } catch (playError) {
        console.error('🎥 ❌ Video play failed:', playError)
        setIsLoading(false)
      }
      
      console.log('🎥 ✅ Camera initialization complete', { elapsed: performance.now() - t0 })
    } catch (err: any) {
      console.error('🎥 ❌ Camera initialization failed:', {
        elapsed: performance.now() - t0,
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
  
  // Background upgrade to high-res for better capture quality
  const upgradeToHighResInBackground = useCallback(async (currentStream: MediaStream, startTime: number) => {
    try {
      console.log('🎥 🔄 Starting background upgrade to high-res', { elapsed: performance.now() - startTime })
      
      // Don't upgrade if we already have good resolution
      const videoTrack = currentStream.getVideoTracks()[0]
      if (videoTrack) {
        const settings = videoTrack.getSettings()
        if (settings.width && settings.width >= 1280) {
          console.log('🎥 ✅ Already high-res, skipping upgrade', { 
            width: settings.width, 
            height: settings.height 
          })
          return
        }
      }
      
      const highResConstraints = {
        video: {
          width: { ideal: width, min: 640 },
          height: { ideal: height, min: 480 },
          facingMode: { ideal: facingMode },
          frameRate: { ideal: 30 }
        }
      }
      
      const highResStream = await navigator.mediaDevices.getUserMedia(highResConstraints)
      console.log('🎥 ✅ High-res stream obtained', { 
        elapsed: performance.now() - startTime,
        newResolution: highResStream.getVideoTracks()[0]?.getSettings()
      })
      
      // Replace cached stream with high-res version
      if (cachedStream === currentStream) {
        // Stop old tracks
        currentStream.getTracks().forEach(track => track.stop())
        
        // Update cache
        cachedStream = highResStream
        setStream(highResStream)
        
        // Update video element if still active
        if (videoRef.current && videoRef.current.srcObject === currentStream) {
          videoRef.current.srcObject = highResStream
        }
        
        console.log('🎥 ✅ Upgraded to high-res stream', { elapsed: performance.now() - startTime })
      } else {
        // Current stream was replaced, stop the high-res stream
        highResStream.getTracks().forEach(track => track.stop())
      }
      
    } catch (upgradeError) {
      console.warn('🎥 ⚠️ High-res upgrade failed (not critical):', upgradeError)
    }
  }, [width, height, facingMode])

  const retryCamera = useCallback(() => {
    console.log('🎥 Retrying camera...')
    // Clear any error state
    setError(null)
    
    // Clear cached stream on retry to force fresh attempt
    cleanupCachedStream()
    
    if (stream) {
      stopStream(stream)
      setStream(null)
    }
    
    // Try again
    startCamera()
  }, [stream, startCamera])

  const stopCamera = () => {
    console.log('🎥 Stopping camera modal...')
    
    // Stop the current stream immediately when modal closes
    if (stream) {
      console.log('🎥 Stopping current stream tracks')
      stopStream(stream)
      setStream(null)
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    // Keep cached stream for warm restarts, but ensure current stream is stopped
    // If current stream is the cached stream, we need to clear cache to avoid reusing stopped stream
    if (stream === cachedStream) {
      console.log('🎥 Current stream was cached stream, clearing cache')
      cachedStream = null
      cachedDeviceId = null
    }
    
    setIsOpen(false)
    setError(null)
    setIsLoading(false)
    
    console.log('🎥 ✅ Camera modal closed and stream stopped')
  }
  
  // Function to fully cleanup cached stream (call on app unmount or when truly done)
  const cleanupCamera = useCallback(() => {
    console.log('🎥 Full camera cleanup...')
    
    if (stream) {
      stopStream(stream)
      setStream(null)
    }
    
    cleanupCachedStream()
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsOpen(false)
    setError(null)
    setIsLoading(false)
  }, [stream])

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

  // Cleanup on unmount - full cleanup when component unmounts
  useEffect(() => {
    return () => {
      console.log('🎥 Component unmounting - full cleanup')
      cleanupCachedStream()
    }
  }, [])

  return {
    isOpen,
    stream,
    error,
    isLoading,
    videoRef,
    startCamera,
    stopCamera,
    cleanupCamera,
    capturePhoto,
    downloadPhoto,
    checkCameraSupport,
    retryCamera
  }
}