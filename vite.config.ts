import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
  },
  build: {
    // Increases the warning threshold to 1000 KB (1 MB)
    chunkSizeWarningLimit: 1000, 
  }
})