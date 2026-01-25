import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FestivalGolpeTierra2026',
  build: {
    // Desactivar sourcemaps para reducir el tamaño del build
    sourcemap: false,
    // Optimización de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // Reducir advertencia de tamaño de chunk
    chunkSizeWarningLimit: 1000,
  }
})
