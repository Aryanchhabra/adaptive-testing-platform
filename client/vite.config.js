import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          // Increase timeout for slower responses
          proxy.options.proxyTimeout = 30000; // 30 seconds
          proxy.options.timeout = 30000;
          
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from server:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
})
