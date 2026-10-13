import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import AuthPage from './auth/AuthPage.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { useAuth } from './auth/authContext.js'
import { dashboardPathForRole } from './auth/roleRoutes.js'

function HomeRedirect() {
  const { user } = useAuth()
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/dashboard/ngo" element={<DashboardRoute authRole="NGO" dashboardRole="NGO" />} />
      <Route path="/dashboard/donor" element={<DashboardRoute authRole="Donor" dashboardRole="Donor" />} />
      <Route path="/dashboard/user" element={<DashboardRoute authRole="User" dashboardRole="Recipient" />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
