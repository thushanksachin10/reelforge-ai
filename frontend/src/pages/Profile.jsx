import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'N/A'

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Avatar card */}
          <div className="glass-card p-8 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-brand
                            flex items-center justify-center
                            text-white text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="bg-brand-purple/10 border border-brand-purple/20
                            rounded-full px-4 py-1.5 text-brand-purple text-xs font-medium">
              Free Plan
            </div>
          </div>

          {/* Details */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <h2 className="text-white font-semibold">Account Details</h2>

            <div className="flex items-center gap-4 py-3
                            border-b border-white/5">
              <div className="w-9 h-9 rounded-xl bg-white/5
                              flex items-center justify-center">
                <FiUser size={16} className="text-brand-purple" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="text-white text-sm font-medium mt-0.5">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3
                            border-b border-white/5">
              <div className="w-9 h-9 rounded-xl bg-white/5
                              flex items-center justify-center">
                <FiMail size={16} className="text-brand-pink" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="text-white text-sm font-medium mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-white/5
                              flex items-center justify-center">
                <FiCalendar size={16} className="text-brand-cyan" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="text-white text-sm font-medium mt-0.5">{joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="glass-card p-4 flex items-center gap-3 w-full
                       hover:border-red-500/30 hover:bg-red-500/5
                       transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/10
                            flex items-center justify-center">
              <FiLogOut size={16} className="text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-red-400 text-sm font-medium">Sign Out</p>
              <p className="text-slate-600 text-xs">You'll need to log in again</p>
            </div>
          </button>

        </motion.div>
      </div>
    </div>
  )
}