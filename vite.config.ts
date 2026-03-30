import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Raise warning limit — large deps like firebase/supabase/recharts are expected
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Split vendor code into separate cached chunks
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router'],
          'vendor-ui':       ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts':   ['recharts'],
          'vendor-motion':   ['motion'],
          'vendor-icons':    ['lucide-react'],
        },
      },
    },
  },
})
