import { useNavigate } from 'react-router-dom'
import { FiCopy, FiTrash2, FiZap, FiExternalLink } from 'react-icons/fi'
import { scriptAPI } from '../services/api.js'
import toast from 'react-hot-toast'

export default function ScriptCard({ script, folders = [], onDelete, onDuplicate, onFolderChange }) {
  const navigate = useNavigate()

  const viralColor =
    script.viralScore >= 80 ? 'text-green-400' :
    script.viralScore >= 60 ? 'text-yellow-400' : 'text-red-400'

  const platformColors = {
    Instagram:        'bg-pink-500/20 text-pink-300',
    'YouTube Shorts': 'bg-red-500/20 text-red-300',
    TikTok:           'bg-cyan-500/20 text-cyan-300',
    LinkedIn:         'bg-blue-500/20 text-blue-300',
    'Twitter/X':      'bg-slate-500/20 text-slate-300',
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this script?')) return
    try {
      await scriptAPI.delete(script._id)
      onDelete(script._id)
      toast.success('Script deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleDuplicate = async (e) => {
    e.stopPropagation()
    try {
      const res = await scriptAPI.duplicate(script._id)
      onDuplicate(res.data.script)
      toast.success('Script duplicated')
    } catch {
      toast.error('Failed to duplicate')
    }
  }

  const handleFolderChange = async (e) => {
    const folderId = e.target.value || null
    try {
      const res = await scriptAPI.update(script._id, { folderId })
      onFolderChange(script._id, folderId)
      toast.success(folderId ? 'Moved to folder' : 'Removed from folder')
    } catch {
      toast.error('Failed to update folder')
    }
  }

  return (
    <div
      onClick={() => navigate(`/project/${script._id}`)}
      className="glass-card p-5 cursor-pointer hover:border-brand-purple/40
                 hover:bg-white/6 transition-all duration-300 animate-fade-in group"
    >
      
      {/* AI Thumbnail */}
      {script.thumbnailUrl && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
          <img
            src={script.thumbnailUrl}
            alt="AI Thumbnail"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}


      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 flex-1">
          {script.title || 'Untitled Script'}
        </h3>
        <div className={`flex items-center gap-1 text-xs font-bold shrink-0 ${viralColor}`}>
          <FiZap size={12} />
          {script.viralScore}
        </div>
      </div>

      {/* Hook preview */}
      <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
        {script.hook || 'No hook generated'}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${platformColors[script.platform] || 'bg-white/10 text-slate-300'}`}>
          {script.platform}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium
                         bg-purple-500/20 text-purple-300">
          {script.niche}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium
                         bg-white/10 text-slate-400">
          {script.style}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-slate-600 text-xs">
          {new Date(script.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
        <div className="flex items-center gap-1
                        opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white
                       hover:bg-white/10 transition-all"
            title="Duplicate"
          >
            <FiCopy size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/project/${script._id}`) }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white
                       hover:bg-white/10 transition-all"
            title="Open"
          >
            <FiExternalLink size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400
                       hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>

      {/* Folder assignment */}
      <div
        className="mt-3 pt-3 border-t border-white/5"
        onClick={e => e.stopPropagation()}
      >
        <select
          value={script.folderId?._id || script.folderId || ''}
          onChange={handleFolderChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg
                     px-3 py-1.5 text-xs text-slate-400
                     focus:outline-none focus:border-brand-purple
                     transition-colors duration-200 cursor-pointer"
        >
          <option value="">📁 No folder</option>
          {folders.map(f => (
            <option key={f._id} value={f._id}>{f.folderName}</option>
          ))}
        </select>
      </div>
    </div>
  )
}