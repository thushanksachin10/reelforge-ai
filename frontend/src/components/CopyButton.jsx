import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                  transition-all duration-200
                  ${copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'}
                  ${className}`}
    >
      {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}