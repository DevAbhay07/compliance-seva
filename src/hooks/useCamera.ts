import { useState, useRef, useEffect } from 'react'

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

  const startCamera = async () => {
    try {
      setError(null)
      setIsLoading(true)
      console.log('🎥 Starting camera initialization...')
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this browser')
      }

      console.log('🎥 Requesting camera permissions...')
      
      // Simplified approach: try the most basic constraints first
      let mediaStream: MediaStream
      
      try {
        // Try basic constraints first (most compatible)
        console.log('🎥 Attempting with basic constraints')
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 }
          }
        })
        console.log('🎥 ✅ Camera started with basic constraints')
      } catch (basicError) {
        console.warn('🎥 ⚠️ Basic constraints failed:', basicError)
        
        try {
          // Fallback to absolute minimal constraints
          console.log('🎥 Attempting with minimal constraints')
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true
          })
          console.log('🎥 ✅ Camera started with minimal constraints')
        } catch (minimalError) {
          console.error('🎥 ❌ All camera attempts failed:', minimalError)
          throw minimalError
        }
      }
      
      console.log('🎥 MediaStream obtained:', mediaStream)
      console.log('🎥 Video tracks:', mediaStream.getVideoTracks())
      
      setStream(mediaStream)
      setIsOpen(true)
      
      // Set video source immediately
      if (videoRef.current) {
        console.log('🎥 Setting video source...')
        videoRef.current.srcObject = mediaStream
        
        // Force video to play and set loading to false immediately
        try {
          await videoRef.current.play()
          console.log('🎥 ✅ Video playing successfully')
          setIsLoading(false)
        } catch (playError) {
          console.warn('🎥 ⚠️ Video play failed, but continuing:', playError)
          setIsLoading(false) // Set loading to false anyway
        }
      } else {
        console.warn('🎥 ⚠️ No video ref available')
        setIsLoading(false)
      }
      
      console.log('🎥 ✅ Camera initialization complete')
    } catch (err) {
      console.error('🎥 ❌ Camera error:', err)
      setIsLoading(false)
      
      let errorMessage = 'Unable to access camera. '
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage += 'Please allow camera permissions and try again.'
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera found on this device.'
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported on this browser.'
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage += 'Camera is being used by another application.'
        } else {
          errorMessage += err.message || 'Unknown error occurred.'
        }
      } else {
        errorMessage += 'Please check your camera settings and try again.'
      }
      
      setError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsOpen(false)
    setError(null)
    setIsLoading(false)
  }

  const capturePhoto = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        
        if (context) {
          context.drawImage(videoRef.current, 0, 0)
          canvas.toBlob((blob) => {
            resolve(blob)
          }, 'image/jpeg', 0.9)
        } else {
          resolve(null)
        }
      } else {
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
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
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
    checkCameraSupport
  }
}