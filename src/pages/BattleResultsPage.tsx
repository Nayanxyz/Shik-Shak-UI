import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Crown, Swords, ArrowRight, Zap, Target, Users } from 'lucide-react'
import { cn } from '../lib/utils'
import { useGameStore } from '../store/gameStore'
import { useSeasonTheme } from '../lib/seasonTheme'

export default function BattleResultsPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const store = useGameStore()
  const T = useSeasonTheme()
  const rankings = store.finalRankings || []

  useEffect(() => {
    if (!rankings.length) navigate('/battle/lobby')
  }, [rankings, navigate])

  if (!rankings.length) return null

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Battle Complete!</h1>
          <p className="text-slate-600 mt-2 font-mono">Room: {roomCode}</p>
        </div>

        {rankings[0] && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center relative overflow-hidden shadow-sm">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2 relative z-10" />
            <div className="text-sm uppercase tracking-widest text-amber-600 font-semibold relative z-10">Champion</div>
            <div className="text-2xl font-bold mt-1 text-slate-900 relative z-10">{rankings[0].name}</div>
            <div className="text-slate-600 mt-2 relative z-10 font-medium">
              {rankings[0].total_score} points • {rankings[0].accuracy}% accuracy
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {rankings.map((p: any, i: number) => (
            <motion.div key={p.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.01] backdrop-blur-sm shadow-sm",
                i === 0 ? "bg-amber-50/90 border-amber-200" :
                i === 1 ? "bg-slate-100/90 border-slate-300" :
                i === 2 ? "bg-orange-50/90 border-orange-200" :
                "bg-white/80 border-slate-200"
              )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                  i === 0 ? "bg-amber-100 text-amber-700 border border-amber-300" :
                  i === 1 ? "bg-slate-200 text-slate-600 border border-slate-300" :
                  i === 2 ? "bg-orange-100 text-orange-700 border border-orange-300" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                )}>
                  {i === 0 ? <Crown className="w-6 h-6" /> : p.rank}
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900">{p.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 border border-slate-200">
                      <Target className="w-3 h-3" /> {p.accuracy}%
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 border border-slate-200">
                      <Zap className="w-3 h-3" /> Streak {p.max_streak}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 border border-slate-200">
                      <Users className="w-3 h-3" /> {p.correct_count} correct
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-2xl font-bold font-mono", T.text)}>{p.total_score}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">points</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={() => { store.resetGame(); navigate('/battle/lobby') }}
            className={cn("flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.01]", T.btn)}>
            <Swords className="w-5 h-5" /> New Battle
          </button>
          <button onClick={() => { store.resetGame(); navigate('/') }}
            className="flex-1 py-4 rounded-xl font-semibold bg-white/80 hover:bg-white border border-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] shadow-sm">
            <ArrowRight className="w-5 h-5" /> Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}