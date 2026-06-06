import { networkInterfaces } from 'os'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = 'https://ssh.gsmsv.site:32641'
const AIKON_TARGET = 'http://ssh.gsmsv.site:36375'

function getNetworkIP(): string | null {
  for (const iface of Object.values(networkInterfaces())) {
    for (const net of iface ?? []) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return null
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __NETWORK_IP__: JSON.stringify(getNetworkIP()),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/s3': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      '/aikon': {
        target: AIKON_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
