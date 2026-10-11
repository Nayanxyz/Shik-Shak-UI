import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Target, CheckCircle, XCircle, RotateCcw, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import { cn } from '../lib/utils'
import { apiFetch } from '../lib/api'
import { useSeasonTheme } from '../lib/seasonTheme'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const T = useSeasonTheme()
  const sessionId = location.state?.sessionId
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) { navigate('/practice'); return }
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
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-slate-500 rounded-full animate-spin" />
        </div>
        <p className="text-slate-600 font-medium">Loading your results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-900">Failed to load results</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button onClick={() => navigate('/practice')} className={cn("px-6 py-3 rounded-xl font-semibold transition-all", T.btn)}>
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
    <div className="max-w-2xl mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Practice Complete!</h1>
          <p className="text-slate-600 mt-2">Here's how you performed</p>
        </div>

        {/* Score card — gradient follows the season */}
        <div className={cn("p-8 rounded-2xl border text-center relative overflow-hidden backdrop-blur-sm shadow-sm bg-white/80", T.border)}>
          <div className={cn("relative z-10 text-6xl font-black bg-gradient-to-r bg-clip-text text-transparent drop-shadow-sm", T.gradient)}>
            {totalScore}
          </div>
          <div className="relative z-10 text-slate-600 mt-2 font-medium uppercase tracking-wider text-sm">Total Score</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{correct}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Correct</div>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{wrong}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Wrong</div>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-slate-200 text-center">
            <Target className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">{total}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Total</div>
          </div>
          <div className={cn("p-4 rounded-xl border text-center", T.softBg, T.border)}>
            <Target className={cn("w-6 h-6 mx-auto mb-2", T.text)} />
            <div className={cn("text-2xl font-bold", T.text)}>{accuracy}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Accuracy</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Overall Accuracy</span>
            <span className={cn("text-sm font-bold", T.text)}>{accuracy}%</span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              className={cn(
                "h-full rounded-full relative bg-gradient-to-r",
                accuracy >= 80 ? "from-green-500 to-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" :
                accuracy >= 60 ? "from-amber-500 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" :
                "from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              )}
            />
          </div>
        </div>

        <div className={cn(
          "p-5 rounded-xl border text-center backdrop-blur-sm",
          accuracy >= 80 ? "bg-green-50 border-green-200" :
          accuracy >= 60 ? "bg-amber-50 border-amber-200" :
          "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {accuracy >= 80 ? <Zap className="w-5 h-5 text-green-600" /> :
             accuracy >= 60 ? <TrendingUp className="w-5 h-5 text-amber-600" /> :
             <Target className="w-5 h-5 text-red-600" />}
            <span className={cn("font-bold text-lg", accuracy >= 80 ? "text-green-700" : accuracy >= 60 ? "text-amber-700" : "text-red-700")}>
              {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good effort!' : 'Keep practicing!'}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {accuracy >= 80 ? 'You mastered these concepts. Ready for a harder difficulty?' :
             accuracy >= 60 ? 'You\'re getting there. Review the explanations and try again!' :
             'Don\'t give up! Practice makes perfect. Try foundation level first.'}
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={() => navigate('/practice')}
            className={cn("flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.01]", T.btn)}>
            <RotateCcw className="w-5 h-5" /> Practice Again
          </button>
          <button onClick={() => navigate('/battle/lobby')}
            className="flex-1 py-4 rounded-xl font-semibold bg-white/80 hover:bg-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] shadow-sm">
            <ArrowRight className="w-5 h-5" /> Battle Mode
          </button>
        </div>
      </motion.div>
    </div>
  )
}