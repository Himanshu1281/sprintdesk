import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import { Skeleton } from './components/ui/Skeleton'
import { useAuthStore } from './store/useAuthStore'
import { refreshApi } from './api/auth'
import { Loader2 } from './components/ui/Icons'

const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Board = React.lazy(() => import('./pages/Board').then(m => ({ default: m.Board })))
const Analytics = React.lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))

function Fallback() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

function AuthValidator({ children }: { children: React.ReactNode }) {
  const { accessToken, refreshToken, setAccessToken, logout } = useAuthStore()
  const [isValidating, setIsValidating] = React.useState(false)
  const [hasValidated, setHasValidated] = React.useState(false)

  React.useEffect(() => {
    if (!accessToken && refreshToken && !hasValidated) {
      setIsValidating(true)
      refreshApi(refreshToken)
        .then(data => {
          setAccessToken(data.accessToken)
        })
        .catch(() => {
          logout()
        })
        .finally(() => {
          setIsValidating(false)
          setHasValidated(true)
        })
    } else {
      setHasValidated(true)
    }
  }, [accessToken, refreshToken, hasValidated, setAccessToken, logout])

  if (isValidating || (!hasValidated && !accessToken && refreshToken)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  return (
    <React.Suspense fallback={<Fallback />}>
      <AuthValidator>
        <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </AuthValidator>
    </React.Suspense>
  )
}

export default App
