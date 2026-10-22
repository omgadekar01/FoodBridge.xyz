import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext.js'
import { requiresFssaiVerification } from './authService.js'
import { dashboardPathForRole } from './roleRoutes.js'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== requiredRole) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }
  if (requiresFssaiVerification(user)) return <Navigate to="/verify-fssai" replace />

  return children
}
