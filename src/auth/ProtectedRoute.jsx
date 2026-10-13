import { Navigate } from 'react-router-dom'
import { useAuth } from './authContext.js'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== requiredRole) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return children
}
