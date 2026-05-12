import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiInfo } from 'react-icons/fi'
import Navbar  from '../components/Navbar.jsx'
import Loader  from '../components/Loader.jsx'
import { scriptAPI } from '../services/api.js'
import toast from 'react-hot-toast'

const PLATFORMS = ['Instagram', 'YouTube Shorts', 'TikTok', 'LinkedIn', 'Twitter/X']
const STYLES    = ['Educational', 'Entertaining', 'Motivational', 'Storytelling', 'Tutorial']
const NICHES    = [
  'Technology', 'Finance', 'Health & Fitness', 'Lifestyle',
  'Business', 'Fashion', 'Food', 'Travel', 'Education',
  'Entertainment', 'Sports', 'Self Improvement', 'Marketing', 'Other'
]

export default function Generator() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    topic: '', niche: '', platform: '', style: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { topic, niche, platform, style } = form
    if (!topic.trim() || !niche || !platform || !style) {
      toast.error('Please fill in all fields')
      return
    }
    if (topic.trim().length < 5) {
      toast.error('Topic must be at least 5 characters')
      return
    }
    try {
      setLoading(true)
      const res = await scriptAPI.generate(form)
      toast.success('Content generated!')
      navigate(`/project/${res.data.script._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-24">
          <Loader message="ReelForge AI is working its magic..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-purple/10
                            border border-brand-purple/20 rounded-full
                            px-4 py-1.5 text-brand-purple text-sm font-medium mb-4">
              <FiZap size={14} /> AI Content Generator
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Generate Your{' '}
              <span className="bg-gradient-to-r from-brand-purple to-brand-pink
                               bg-clip-text text-transparent">
                Viral Reel
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Fill in the details below and AI will generate a complete
              script, scenes, hashtags, and more.
            </p>
          </div>

          {/* Form */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Topic */}
              <div>
                <label className="label-text">Video Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. 5 morning habits that changed my life"
                  className="input-dark"
                />
                <p className="text-slate-600 text-xs mt-1.5 flex items-center gap-1">
                  <FiInfo size={11} /> Be specific for better results
                </p>
              </div>

              {/* Niche */}
              <div>
                <label className="label-text">Niche / Category</label>
                <select
                  name="niche"
                  value={form.niche}
                  onChange={handleChange}
                  className="input-dark appearance-none"
                >
                  <option value="" disabled>Select your niche...</option>
                  {NICHES.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Platform */}
              <div>
                <label className="label-text">Target Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, platform: p }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium
                                  border transition-all duration-200
                                  ${form.platform === p
                                    ? 'border-brand-purple bg-brand-purple/20 text-white'
                                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="label-text">Content Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STYLES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, style: s }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium
                                  border transition-all duration-200
                                  ${form.style === s
                                    ? 'border-brand-pink bg-brand-pink/20 text-white'
                                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-base
                                               flex items-center justify-center gap-2">
                <FiZap size={18} />
                Generate Viral Content
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}