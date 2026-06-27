import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Crown, Swords, ArrowRight, Zap, Target, Users } from 'lucide-react'
import { cn } from '../lib/utils'
import { useGameStore } from '../store/gameStore'

export default function BattleResultsPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const store = useGameStore()
  const rankings = store.finalRankings || []

  useEffect(() => {
    if (!rankings.length) {
      navigate('/battle/lobby')
    }
  }, [rankings, navigate])

  if (!rankings.length) return null

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold">Battle Complete!</h1>
          <p className="text-slate-400 mt-2">Room: {roomCode}</p>
        </div>

        {rankings[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-500/30 text-center"
          >
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg text-yellow-300 font-semibold">Winner</div>
            <div className="text-2xl font-bold mt-1">{rankings[0].name}</div>
            <div className="text-slate-400 mt-1">
              {rankings[0].total_score} points • {rankings[0].accuracy}% accuracy
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {rankings.map((p: any, i: number) => (
            <motion.div
              key={p.user_id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border",
                i === 0 ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30" :
                i === 1 ? "bg-gradient-to-r from-slate-400/10 to-slate-500/10 border-slate-400/30" :
                i === 2 ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30" :
                "bg-slate-900 border-slate-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                  i === 0 ? "bg-yellow-500 text-yellow-950" :
                  i === 1 ? "bg-slate-400 text-slate-950" :
                  i === 2 ? "bg-orange-500 text-orange-950" :
                  "bg-slate-800 text-slate-400"
                )}>
                  {i === 0 ? <Crown className="w-6 h-6" /> : p.rank}
                </div>
                <div>
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {p.accuracy}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Streak {p.max_streak}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {p.correct_count} correct
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-300">{p.total_score}</div>
                <div className="text-sm text-slate-400">points</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              store.resetGame()
              navigate('/battle/lobby')
            }}
            className="flex-1 py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            New Battle
          </button>
          <button
            onClick={() => {
              store.resetGame()
              navigate('/')
            }}
            className="flex-1 py-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}