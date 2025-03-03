import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // rollupOptions: {
    //   input: {
    //     main: "./index.html",
    //   },
    // },
    outDir: "./news_front_dist",
    emptyOutDir: true,
  },
  server: {
    // port: 9090,
    proxy: {
      '/edit': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path,
        // targetPort: 3000
      },
      '/view': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path,
        // targetPort: 3000
      }

    }
  },
  plugins: [react()],
})
