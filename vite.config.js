import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['react-map-gl'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // এখানে @ মানে ./src
      'react-map-gl': 'react-map-gl/dist/es6',
    },
  },
})
