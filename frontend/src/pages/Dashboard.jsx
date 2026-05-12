import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiFileText, FiFolder, FiTrendingUp,
         FiPlus, FiSearch, FiGrid } from 'react-icons/fi'
import Navbar    from '../components/Navbar.jsx'
import ScriptCard from '../components/ScriptCard.jsx'
import { scriptAPI, folderAPI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user }                    = useAuth()
  const navigate                    = useNavigate()
  const [scripts, setScripts]       = useState([])
  const [folders, setFolders]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search,  setSearch]        = useState('')
  const [newFolder, setNewFolder]   = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, fRes] = await Promise.all([
          scriptAPI.getAll(),
          folderAPI.getAll()
        ])
        setScripts(sRes.data.scripts)
        setFolders(fRes.data.folders)
      } catch {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateFolder = async () => {
    if (!newFolder.trim()) return
    try {
      const res = await folderAPI.create({ folderName: newFolder.trim() })
      setFolders(prev => [res.data.folder, ...prev])
      setNewFolder('')
      setShowFolderInput(false)
      toast.success('Folder created')
    } catch {
      toast.error('Failed to create folder')
    }
  }

  const [activeFolder, setActiveFolder] = useState(null) // null = show all

  const handleFolderChange = (scriptId, folderId) => {
  setScripts(prev =>
    prev.map(s => s._id === scriptId ? { ...s, folderId } : s)
  )
}
  const handleDeleteFolder = async (id) => {
    if (!window.confirm('Delete this folder? Scripts will be unassigned.')) return
    try {
      await folderAPI.delete(id)
      setFolders(prev => prev.filter(f => f._id !== id))
      toast.success('Folder deleted')
    } catch {
      toast.error('Failed to delete folder')
    }
  }

  const handleDeleteScript = (id) =>
    setScripts(prev => prev.filter(s => s._id !== id))

  const handleDuplicateScript = (script) =>
    setScripts(prev => [script, ...prev])

  const filtered = scripts.filter(s => {
  const matchesSearch =
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.topic?.toLowerCase().includes(search.toLowerCase()) ||
    s.niche?.toLowerCase().includes(search.toLowerCase())

  const matchesFolder = activeFolder
    ? (s.folderId?._id || s.folderId) === activeFolder
    : true

  return matchesSearch && matchesFolder
})

  const avgViralScore =
    scripts.length
      ? Math.round(scripts.reduce((a, s) => a + (s.viralScore || 0), 0) / scripts.length)
      : 0

  const stats = [
    { label: 'Total Scripts', value: scripts.length, icon: FiFileText, color: 'text-brand-purple' },
    { label: 'Avg Viral Score', value: `${avgViralScore}%`, icon: FiTrendingUp, color: 'text-brand-pink' },
    { label: 'Folders', value: folders.length, icon: FiFolder, color: 'text-brand-cyan' },
    { label: 'This Week', value: scripts.filter(s =>
        new Date(s.createdAt) > new Date(Date.now() - 7 * 86400000)
      ).length, icon: FiZap, color: 'text-green-400'
    },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : 'evening'},{' '}
            <span className="bg-gradient-to-r from-brand-purple to-brand-pink
                             bg-clip-text text-transparent">
              {user?.name?.split(' ')[0]}
            </span>{' '}
            👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Here's your content creation overview
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className={`${s.color} mb-3`}>
                <s.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Folders */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Folders</h2>
            <button
              onClick={() => setShowFolderInput(true)}
              className="btn-outline text-sm flex items-center gap-1.5"
            >
              <FiPlus size={14} /> New Folder
            </button>
          </div>

          {showFolderInput && (
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={newFolder}
                onChange={e => setNewFolder(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Folder name..."
                className="input-dark max-w-xs"
                autoFocus
              />
              <button onClick={handleCreateFolder} className="btn-primary py-3 px-5 text-sm">
                Create
              </button>
              <button
                onClick={() => { setShowFolderInput(false); setNewFolder('') }}
                className="btn-outline text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {folders.length === 0 ? (
  <p className="text-slate-600 text-sm">
    No folders yet. Create one to organise your scripts.
  </p>
) : (
  <div className="flex flex-wrap gap-3">
    {/* All scripts pill */}
    <button
      onClick={() => setActiveFolder(null)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border
                  transition-all duration-200 text-sm font-medium
                  ${activeFolder === null
                    ? 'border-brand-purple bg-brand-purple/20 text-white'
                    : 'glass-card border-white/8 text-slate-400 hover:border-brand-purple/40'}`}
    >
      <FiGrid size={14} /> All Scripts
    </button>

    {folders.map(folder => {
      const count = scripts.filter(s =>
        (s.folderId?._id || s.folderId) === folder._id
      ).length

      return (
        <div
          key={folder._id}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border
                      transition-all duration-200 group
                      ${activeFolder === folder._id
                        ? 'border-brand-purple bg-brand-purple/20'
                        : 'glass-card border-white/8 hover:border-brand-purple/40'}`}
        >
          <button
            onClick={() => setActiveFolder(
              activeFolder === folder._id ? null : folder._id
            )}
            className="flex items-center gap-2 text-sm font-medium text-slate-300"
          >
            <FiFolder size={14} className="text-brand-cyan" />
            {folder.folderName}
            <span className="text-xs text-slate-500 font-normal">({count})</span>
          </button>
          <button
            onClick={() => handleDeleteFolder(folder._id)}
            className="text-slate-600 hover:text-red-400 transition-colors
                       opacity-0 group-hover:opacity-100 ml-1 text-base leading-none"
          >
            ×
          </button>
        </div>
      )
    })}
  </div>
)}
        </div>

        {/* Scripts */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-white">
  {activeFolder
    ? folders.find(f => f._id === activeFolder)?.folderName
    : 'Recent Scripts'
  }{' '}
  <span className="text-slate-600 text-sm font-normal">
    ({filtered.length})
  </span>
</h2>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                     text-slate-500" size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search scripts..."
                  className="input-dark pl-9 py-2 text-sm w-52"
                />
              </div>
              <button
                onClick={() => navigate('/generator')}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
              >
                <FiZap size={14} /> Generate
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-brand-purple
                              border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <FiFileText size={36} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No scripts yet</p>
              <p className="text-slate-600 text-sm mt-1 mb-6">
                Generate your first viral reel script
              </p>
              <button
                onClick={() => navigate('/generator')}
                className="btn-primary"
              >
                Generate Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(s => (
                <ScriptCard
  key={s._id}
  script={s}
  folders={folders}
  onDelete={handleDeleteScript}
  onDuplicate={handleDuplicateScript}
  onFolderChange={handleFolderChange}
/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}