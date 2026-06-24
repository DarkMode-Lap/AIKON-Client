import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const HomePage = lazy(() => import('@/pages/home'))
const CreatePage = lazy(() => import('@/pages/create'))
const LoadingPage = lazy(() => import('@/pages/loading'))
const ResultPage = lazy(() => import('@/pages/result'))
const AdminPage = lazy(() => import('@/pages/admin'))
const WallPage = lazy(() => import('@/pages/wall'))
const PassPage = lazy(() => import('@/pages/pass'))

function Fallback() {
  return (
    <div className="min-h-dvh bg-white flex items-center justify-center">
      <div className="text-violet-500 text-sm font-bold">로딩 중...</div>
    </div>
  )
}

function wrap(El: React.ComponentType) {
  return (
    <Suspense fallback={<Fallback />}>
      <El />
    </Suspense>
  )
}

function RootLayout() {
  const { pathname } = useLocation()
  return (
    <>
      <Outlet />
      <Analytics />
      <SpeedInsights route={pathname} />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: wrap(HomePage) },
      { path: '/create', element: wrap(CreatePage) },
      { path: '/create/:aikonId', element: <Navigate to="/create" replace /> },
      { path: '/loading', element: wrap(LoadingPage) },
      { path: '/result/:id', element: wrap(ResultPage) },
      { path: '/admin', element: wrap(AdminPage) },
      { path: '/wall', element: wrap(WallPage) },
      { path: '/pass/:passId', element: wrap(PassPage) },
    ],
  },
])
