import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://know-before-you-go-nasa-space-25.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
