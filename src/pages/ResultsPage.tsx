import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Target, CheckCircle, XCircle, RotateCcw, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import { cn } from '../lib/utils'
import { apiFetch } from '../lib/api'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const sessionId = location.state?.sessionId
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) {
      navigate('/practice')
      return
    }
    fetchResults()
  }, [sessionId])

  const fetchResults = async () => {
    try {
      const data = await apiFetch(`/api/v1/practice/${sessionId}/results`)
      setResults(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 font-medium">Loading your results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-200">Failed to load results</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          Try Again
        </button>
      </div>
    )
  }

  const accuracy = results?.accuracy || 0
  const totalScore = results?.total_score || 0
  const correct = results?.correct_count || 0
  const wrong = results?.wrong_count || 0
  const total = correct + wrong

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">Practice Complete!</h1>
          <p className="text-slate-400 mt-2">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 text-center relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
          <div className="relative z-10 text-6xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
            {totalScore}
          </div>
          <div className="relative z-10 text-slate-400 mt-2 font-medium uppercase tracking-wider text-sm">Total Score</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-green-500/20 text-center hover:border-green-500/40 transition-colors">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-300">{correct}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Correct</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-red-500/20 text-center hover:border-red-500/40 transition-colors">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-300">{wrong}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Wrong</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-blue-500/20 text-center hover:border-blue-500/40 transition-colors">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-300">{total}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Total</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-indigo-500/20 text-center hover:border-indigo-500/40 transition-colors">
            <Target className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-300">{accuracy}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Accuracy</div>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">Overall Accuracy</span>
            <span className="text-sm font-bold text-indigo-300">{accuracy}%</span>
          </div>
          <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              className={cn(
                "h-full rounded-full relative",
                accuracy >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" :
                accuracy >= 60 ? "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]" :
                "bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              )}
            />
          </div>
        </div>

        {/* Performance Message */}
        <div className={cn(
          "p-5 rounded-xl border text-center backdrop-blur-sm",
          accuracy >= 80 ? "bg-green-500/5 border-green-500/20" :
          accuracy >= 60 ? "bg-yellow-500/5 border-yellow-500/20" :
          "bg-red-500/5 border-red-500/20"
        )}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {accuracy >= 80 ? <Zap className="w-5 h-5 text-green-400" /> :
             accuracy >= 60 ? <TrendingUp className="w-5 h-5 text-yellow-400" /> :
             <Target className="w-5 h-5 text-red-400" />}
            <span className={cn(
              "font-bold text-lg",
              accuracy >= 80 ? "text-green-300" :
              accuracy >= 60 ? "text-yellow-300" :
              "text-red-300"
            )}>
              {accuracy >= 80 ? 'Excellent!' :
               accuracy >= 60 ? 'Good effort!' :
               'Keep practicing!'}
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {accuracy >= 80 ? 'You mastered these concepts. Ready for a harder difficulty?' :
             accuracy >= 60 ? 'You\'re getting there. Review the explanations and try again!' :
             'Don\'t give up! Practice makes perfect. Try foundation level first.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => navigate('/practice')}
            className="flex-1 py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.01]"
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>
          <button
            onClick={() => navigate('/battle/lobby')}
            className="flex-1 py-4 rounded-xl font-semibold bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <ArrowRight className="w-5 h-5" />
            Battle Mode
          </button>
        </div>
      </motion.div>
    </div>
  )
}