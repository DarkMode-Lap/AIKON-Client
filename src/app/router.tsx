import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

const HomePage = lazy(() => import('@/pages/home'))
const CreatePage = lazy(() => import('@/pages/create'))
const LoadingPage = lazy(() => import('@/pages/loading'))
const ResultPage = lazy(() => import('@/pages/result'))

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

export const router = createBrowserRouter([
  { path: '/', element: wrap(HomePage) },
  { path: '/create', element: wrap(CreatePage) },
  { path: '/create/:aikonId', element: <Navigate to="/create" replace /> },
  { path: '/loading', element: wrap(LoadingPage) },
  { path: '/result/:id', element: wrap(ResultPage) },
])
