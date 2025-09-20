import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '10.131.114.149',
      'a01a3427a04b.ngrok-free.app'
    ],
  },
})