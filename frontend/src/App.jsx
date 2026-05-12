import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login        from './pages/Login.jsx'
import Signup       from './pages/Signup.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import Generator    from './pages/Generator.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Profile      from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent
                        rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"  element={!user ? <Login />  : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/generator"      element={<Generator />} />
        <Route path="/project/:id"    element={<ProjectDetail />} />
        <Route path="/profile"        element={<Profile />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}