import { networkInterfaces } from 'os'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function getNetworkIP(): string | null {
  for (const iface of Object.values(networkInterfaces())) {
    for (const net of iface ?? []) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return null
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_TARGET = env.VITE_API_TARGET
  const AIKON_TARGET = env.VITE_AIKON_TARGET
  return {
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
  }
})
