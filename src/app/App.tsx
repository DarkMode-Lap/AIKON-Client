import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { router } from './router'
import { FooterBadge } from '@/shared/ui'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <FooterBadge />
      <Analytics />
      <SpeedInsights />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e1b4b',
            border: '1.5px solid rgba(139,92,246,0.25)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: "'GmarketSans', sans-serif",
            boxShadow: '0 4px 24px rgba(139,92,246,0.12)',
          },
        }}
      />
    </>
  )
}
