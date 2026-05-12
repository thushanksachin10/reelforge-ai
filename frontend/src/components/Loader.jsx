export default function Loader({ message = 'Generating your content...' }) {
  const steps = [
    'Crafting viral hook...',
    'Writing script...',
    'Breaking down scenes...',
    'Generating hashtags...',
    'Calculating viral score...',
    'Building thumbnail prompt...',
  ]

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4
                        border-brand-purple/20 border-t-brand-purple animate-spin" />
        <div className="absolute inset-2 rounded-full border-4
                        border-brand-pink/20 border-b-brand-pink animate-spin
                        animation-delay-150" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="text-center">
        <p className="text-white font-semibold text-lg">{message}</p>
        <p className="text-slate-500 text-sm mt-1">This takes 10–20 seconds</p>
      </div>

      {/* Animated steps */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-slate-400
                       animate-pulse-slow"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}