import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/users': {
        target: 'http://user-service:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/users')
      },
      '/api/vehicles': {
        target: 'http://vehicle-service:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vehicles/, '/vehicles')
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})