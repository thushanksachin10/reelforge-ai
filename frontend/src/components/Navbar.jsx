import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { FiZap, FiGrid, FiUser, FiLogOut, FiPlusCircle } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50
                    bg-dark-900/80 backdrop-blur-xl
                    border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand
                            flex items-center justify-center text-white text-sm font-bold">
              R
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Reel<span className="text-brand-purple">Forge</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isActive('/dashboard')
                            ? 'bg-white/10 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <FiGrid size={15} /> Dashboard
            </Link>

            <Link
              to="/generator"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isActive('/generator')
                            ? 'bg-white/10 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <FiZap size={15} /> Generator
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isActive('/profile')
                            ? 'bg-white/10 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <FiUser size={15} /> Profile
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/generator" className="btn-primary py-2 px-4 text-sm
                                              hidden sm:flex items-center gap-2">
              <FiPlusCircle size={15} /> New Reel
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-brand
                              flex items-center justify-center
                              text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-white
                           hover:bg-white/5 transition-all duration-200"
                title="Logout"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}