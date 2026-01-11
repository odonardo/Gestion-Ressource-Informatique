import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy TOUTES les requêtes API
      '/api': {
        target: 'https://gestion-ressources-informatiques.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // Proxy pour login, logout, csrf
      '/login': {
        target: 'https://gestion-ressources-informatiques.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/logout': {
        target: 'https://gestion-ressources-informatiques.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/csrf': {
        target: 'https://gestion-ressources-informatiques.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})