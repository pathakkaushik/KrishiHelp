import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ROLE_REDIRECT = {
  FARMER: '/dashboard',
  OFFICER: '/officer/dashboard',
  ADMIN: '/admin/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect = ROLE_REDIRECT[user.role] || '/login'
    return <Navigate to={redirect} replace />
  }

  return children
}
