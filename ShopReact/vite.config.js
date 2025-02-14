import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/storage': {
        target: 'http://localhost:8000', // Your Laravel backend URL
        changeOrigin: true,
      },
    },
  },
})
