import { BrowserRouter, Route, Routes } from 'react-router'
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('@/pages/home'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
