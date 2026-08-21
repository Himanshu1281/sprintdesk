import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const token = useAuthStore((state) => state.accessToken)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
