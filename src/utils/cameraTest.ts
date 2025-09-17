// Camera diagnostic utility
export const testCameraAccess = async () => {
  console.log('🔍 Testing camera access...')
  
  try {
    // Test 1: Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia not supported')
    }
    console.log('✅ getUserMedia API available')
    
    // Test 2: Enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    console.log('📹 Video devices found:', videoDevices.length, videoDevices)
    
    if (videoDevices.length === 0) {
      throw new Error('No video devices found')
    }
    
    // Test 3: Request camera access with minimal constraints
    console.log('🎥 Testing camera access...')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    console.log('✅ Camera access successful!')
    console.log('📊 Stream details:', {
      id: stream.id,
      active: stream.active,
      tracks: stream.getVideoTracks().length
    })
    
    // Test 4: Check video track settings
    const videoTrack = stream.getVideoTracks()[0]
    if (videoTrack) {
      const settings = videoTrack.getSettings()
      console.log('⚙️ Video track settings:', settings)
    }
    
    // Clean up
    stream.getTracks().forEach(track => track.stop())
    console.log('🧹 Stream cleaned up')
    
    return { success: true, devices: videoDevices, message: 'Camera test successful' }
  } catch (error) {
    console.error('❌ Camera test failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: `Camera test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}