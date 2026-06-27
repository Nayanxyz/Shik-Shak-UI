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
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load results</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold"
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
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold">Practice Complete!</h1>
          <p className="text-slate-400 mt-2">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            {totalScore}
          </div>
          <div className="text-slate-400 mt-2">Total Score</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-300">{correct}</div>
            <div className="text-xs text-slate-400">Correct</div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-300">{wrong}</div>
            <div className="text-xs text-slate-400">Wrong</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-300">{total}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <Target className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-300">{accuracy}%</div>
            <div className="text-xs text-slate-400">Accuracy</div>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">Accuracy</span>
            <span className="text-sm font-bold text-indigo-300">{accuracy}%</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={cn(
                "h-full rounded-full",
                accuracy >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                accuracy >= 60 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                "bg-gradient-to-r from-red-500 to-orange-500"
              )}
            />
          </div>
        </div>

        {/* Performance Message */}
        <div className={cn(
          "p-4 rounded-xl border text-center",
          accuracy >= 80 ? "bg-green-500/10 border-green-500/20 text-green-300" :
          accuracy >= 60 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" :
          "bg-red-500/10 border-red-500/20 text-red-300"
        )}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {accuracy >= 80 ? <Zap className="w-5 h-5" /> :
             accuracy >= 60 ? <TrendingUp className="w-5 h-5" /> :
             <Target className="w-5 h-5" />}
            <span className="font-semibold">
              {accuracy >= 80 ? 'Excellent!' :
               accuracy >= 60 ? 'Good effort!' :
               'Keep practicing!'}
            </span>
          </div>
          <p className="text-sm opacity-80">
            {accuracy >= 80 ? 'You mastered these concepts. Ready for a harder difficulty?' :
             accuracy >= 60 ? 'You\'re getting there. Review the explanations and try again!' :
             'Don\'t give up! Practice makes perfect. Try foundation level first.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/practice')}
            className="flex-1 py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>
          <button
            onClick={() => navigate('/battle/lobby')}
            className="flex-1 py-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Battle Mode
          </button>
        </div>
      </motion.div>
    </div>
  )
}