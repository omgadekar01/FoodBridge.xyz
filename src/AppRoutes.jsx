import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import AuthPage from './auth/AuthPage.jsx'
import FssaiVerificationModal from './auth/FssaiVerificationModal.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { useAuth } from './auth/authContext.js'
import { requiresFssaiVerification } from './auth/authService.js'
import { dashboardPathForRole } from './auth/roleRoutes.js'

function HomeRedirect() {
  const { user } = useAuth()
  if (requiresFssaiVerification(user)) return <Navigate to="/verify-fssai" replace />
  return <Navigate to={user ? dashboardPathForRole(user.role) : '/login'} replace />
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  return user ? <HomeRedirect /> : children
}

function DashboardRoute({ authRole, dashboardRole }) {
  const { logout } = useAuth()
  return (
    <ProtectedRoute requiredRole={authRole}>
      <App role={dashboardRole} onLogout={logout} />
    </ProtectedRoute>
  )
}

function FssaiVerificationRoute() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'Donor') {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }
  if (!requiresFssaiVerification(user)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return <FssaiVerificationModal />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/verify-fssai" element={<FssaiVerificationRoute />} />
      <Route path="/dashboard/ngo" element={<DashboardRoute authRole="NGO" dashboardRole="NGO" />} />
      <Route path="/dashboard/donor" element={<DashboardRoute authRole="Donor" dashboardRole="Donor" />} />
      <Route path="/dashboard/user" element={<DashboardRoute authRole="User" dashboardRole="Recipient" />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
