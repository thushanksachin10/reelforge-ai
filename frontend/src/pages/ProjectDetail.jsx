import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiZap, FiEdit2, FiSave, FiTrash2, FiCopy,
  FiArrowLeft, FiHash, FiFilm, FiTarget, FiImage 
} from 'react-icons/fi'
import Navbar     from '../components/Navbar.jsx'
import CopyButton from '../components/CopyButton.jsx'
import { scriptAPI, folderAPI } from '../services/api.js'
import toast from 'react-hot-toast'

// Reusable section block
function Section({ icon: Icon, title, children, extra }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
          <Icon size={16} className="text-brand-purple" />
          {title}
        </div>
        {extra}
      </div>
      {children}
    </div>
  )
}

export default function ProjectDetail() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [script, setScript]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({})
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    scriptAPI.getById(id)
      .then(res => {
        setScript(res.data.script)
        setForm(res.data.script)
      })
      .catch(() => toast.error('Script not found'))
      .finally(() => setLoading(false))
  }, [id])

  const [folders, setFolders] = useState([])

// Inside the useEffect, after fetching the script:
useEffect(() => {
  Promise.all([
    scriptAPI.getById(id),
    folderAPI.getAll()
  ])
    .then(([sRes, fRes]) => {
      setScript(sRes.data.script)
      setForm(sRes.data.script)
      setFolders(fRes.data.folders)
    })
    .catch(() => toast.error('Script not found'))
    .finally(() => setLoading(false))
}, [id])
  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await scriptAPI.update(id, {
        title:    form.title,
        hook:     form.hook,
        script:   form.script,
        scenes:   form.scenes,
        cta:      form.cta,
        hashtags: form.hashtags,
      })
      setScript(res.data.script)
      setEditing(false)
      toast.success('Script saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this script permanently?')) return
    try {
      await scriptAPI.delete(id)
      toast.success('Deleted')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleDuplicate = async () => {
    try {
      await scriptAPI.duplicate(id)
      toast.success('Duplicated — check dashboard')
    } catch {
      toast.error('Failed to duplicate')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Script not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-outline">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const viralColor =
    script.viralScore >= 80 ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    script.viralScore >= 60 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                              'text-red-400 bg-red-400/10 border-red-400/20'

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white
                       transition-colors text-sm"
          >
            <FiArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <FiSave size={14} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDuplicate}
                  className="btn-outline text-sm flex items-center gap-1.5"
                >
                  <FiCopy size={14} /> Duplicate
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="btn-outline text-sm flex items-center gap-1.5"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-outline text-sm flex items-center gap-1.5
                             hover:border-red-500/40 hover:text-red-400"
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Title + meta */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                {editing ? (
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="input-dark text-xl font-bold"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-white leading-snug">
                    {script.title}
                  </h1>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[script.platform, script.niche, script.style].map(tag => (
                    <span key={tag}
                      className="text-xs px-2.5 py-1 rounded-full
                                 bg-white/10 text-slate-400 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
<div className="mt-4 pt-4 border-t border-white/5">
  <label className="label-text">Folder</label>
  <select
    value={form.folderId?._id || form.folderId || ''}
    onChange={async (e) => {
      const folderId = e.target.value || null
      try {
        const res = await scriptAPI.update(id, { folderId })
        setScript(res.data.script)
        setForm(res.data.script)
        toast.success(folderId ? 'Moved to folder' : 'Removed from folder')
      } catch {
        toast.error('Failed to update folder')
      }
    }}
    className="input-dark text-sm"
  >
    <option value="">📁 No folder</option>
    {folders.map(f => (
      <option key={f._id} value={f._id}>{f.folderName}</option>
    ))}
  </select>
</div>
              </div>

              {/* Viral score badge */}
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl
                               border text-sm font-bold ${viralColor}`}>
                <FiZap size={14} />
                {script.viralScore} Viral Score
              </div>
            </div>
          </div>

          {/* Hook */}
          <Section
            icon={FiZap}
            title="Hook (First 3 Seconds)"
            extra={<CopyButton text={script.hook} />}
          >
            {editing ? (
              <textarea
                value={form.hook}
                onChange={e => setForm(p => ({ ...p, hook: e.target.value }))}
                rows={3}
                className="input-dark resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed text-sm">{script.hook}</p>
            )}
          </Section>

          {/* Script */}
          <Section
            icon={FiFilm}
            title="Full Script"
            extra={<CopyButton text={script.script} />}
          >
            {editing ? (
              <textarea
                value={form.script}
                onChange={e => setForm(p => ({ ...p, script: e.target.value }))}
                rows={10}
                className="input-dark resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {script.script}
              </p>
            )}
          </Section>

          {/* Scenes */}
          <Section
            icon={FiFilm}
            title="Scene Breakdown"
            extra={<CopyButton text={script.scenes} />}
          >
            {editing ? (
              <textarea
                value={form.scenes}
                onChange={e => setForm(p => ({ ...p, scenes: e.target.value }))}
                rows={8}
                className="input-dark resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {script.scenes}
              </p>
            )}
          </Section>

          {/* CTA */}
          <Section
            icon={FiTarget}
            title="Call to Action"
            extra={<CopyButton text={script.cta} />}
          >
            {editing ? (
              <textarea
                value={form.cta}
                onChange={e => setForm(p => ({ ...p, cta: e.target.value }))}
                rows={3}
                className="input-dark resize-none"
              />
            ) : (
              <p className="text-slate-300 leading-relaxed text-sm">{script.cta}</p>
            )}
          </Section>

          {/* Hashtags */}
          <Section
            icon={FiHash}
            title="Hashtags"
            extra={
              <CopyButton text={
                Array.isArray(script.hashtags)
                  ? script.hashtags.join(' ')
                  : script.hashtags
              } />
            }
          >
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(script.hashtags) ? script.hashtags : []).map((tag, i) => (
                <span key={i}
                  className="text-xs px-3 py-1.5 rounded-full
                             bg-brand-purple/15 text-brand-purple
                             border border-brand-purple/20 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </Section>

          {/* Thumbnail prompt */}
          {script.thumbnailUrl && (
  <Section icon={FiImage} title="AI Generated Thumbnail">
    <div className="relative rounded-xl overflow-hidden aspect-video bg-dark-800 flex items-center justify-center">
      <img
        src={script.thumbnailUrl}
        alt="AI Generated Thumbnail"
        className="w-full h-full object-cover animate-fade-in"
        onLoad={(e) => { e.target.style.opacity = 1 }}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
        style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
      />
      <div
        style={{ display: 'none' }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      >
        <p className="text-slate-500 text-sm">Image is still generating...</p>
        <a
          href={script.thumbnailUrl}
          target="_blank"
          rel="noreferrer"
          className="text-brand-purple text-xs underline"
        >
          Open directly in browser
        </a>
      </div>
    </div>
    <p className="text-slate-600 text-xs mt-3">
      Generated via Pollinations AI · May take 10–20 seconds to appear
    </p>
  </Section>
)}
        </motion.div>
      </div>
    </div>
  )
}