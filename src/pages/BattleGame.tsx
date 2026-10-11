import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Clock, Trophy, Zap, LogOut, AlertTriangle, RefreshCw, CheckCircle, XCircle, Crown, Target } from 'lucide-react'
import { cn } from '../lib/utils'
import { getSocket, disconnectSocket } from '../lib/socket'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import MathHtml from '../components/MathHtml'

export default function BattleGame() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const store = useGameStore()
  const authUser = useAuthStore((s) => s.user)

  const [phase, setPhase] = useState<'playing' | 'results' | 'leaderboard' | 'finished'>('playing')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [numericalInput, setNumericalInput] = useState<string>('')
  const [notification, setNotification] = useState<string | null>(null);
  const [forfeitMessage, setForfeitMessage] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [finalRankings, setFinalRankings] = useState<any[]>([])
  const [nextQuestionIn, setNextQuestionIn] = useState(3)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [disconnected, setDisconnected] = useState(false)
  const [error, setError] = useState('')

  const startTimeRef = useRef<number>(0)
  const nextQuestionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const listenersAttached = useRef(false)

  useEffect(() => {
    return () => {
      if (nextQuestionTimerRef.current) {
        clearInterval(nextQuestionTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()

    if (!store.roomCode && roomCode && authUser) {
      socket.emit('rejoin_room', { room_code: roomCode.toUpperCase(), user_id: authUser.id })
    }

    if (listenersAttached.current) return
    listenersAttached.current = true

    socket.on('question_start', (data: any) => {
      store.setQuestion(data, data.total_questions)
      setPhase('playing')
      setSelectedOption(null)
      setNumericalInput('')
      setHasAnswered(false)
      setAnswerResult(null)
      startTimeRef.current = Date.now()
    })

    socket.on('timer_tick', (data: { remaining: number }) => {
      store.setTimeRemaining(data.remaining)
    })

    socket.on('answer_received', (data: any) => {
      setAnswerResult(data)
    })

    socket.on('question_results', (data: any) => {
      store.setQuestionResults(data)
      setPhase('results')
    })

    socket.on('leaderboard', (data: any) => {
      setLeaderboard(data.rankings)
      setNextQuestionIn(data.next_question_in)
      setPhase('leaderboard')

      if (nextQuestionTimerRef.current) clearInterval(nextQuestionTimerRef.current)
      let remaining = data.next_question_in
      nextQuestionTimerRef.current = setInterval(() => {
        remaining -= 1
        setNextQuestionIn(remaining)
        if (remaining <= 0 && nextQuestionTimerRef.current) {
          clearInterval(nextQuestionTimerRef.current)
          nextQuestionTimerRef.current = null
        }
      }, 1000)
    })

    socket.on('game_over', (data: any) => {
      setFinalRankings(data.final_rankings)
      store.setFinalRankings(data.final_rankings)
      setPhase('finished')
      if (nextQuestionTimerRef.current) {
        clearInterval(nextQuestionTimerRef.current)
        nextQuestionTimerRef.current = null
      }
    })

    socket.on('kicked', () => {
      setError('You were kicked from the room')
      setTimeout(() => navigate('/battle/lobby'), 2000)
    })

    socket.on('left_room', () => {
      store.resetGame()
      disconnectSocket()
      navigate('/battle/lobby')
    })

    socket.on('error', (data: any) => {
      setError(data.message)
    })

    socket.on('room_restarted', () => {
      navigate('/battle/lobby');
    })

    socket.on('player_left_notification', (data: any) => {
       setNotification(data.message);
       setTimeout(() => setNotification(null), 5000);
    })

    socket.on('room_forfeited', (data: any) => {
      setPhase('finished'); 
      setError(data.message);
    })

    socket.on('room_forfeited', (data: any) => {
      setForfeitMessage(data.message);
    })

    socket.on('disconnect', () => setDisconnected(true))
    socket.on('connect', () => setDisconnected(false))

    return () => {
      socket.off('question_start')
      socket.off('timer_tick')
      socket.off('answer_received')
      socket.off('question_results')
      socket.off('leaderboard')
      socket.off('game_over')
      socket.off('kicked')
      socket.off('left_room')
      socket.off('error')
      socket.off('disconnect')
      socket.off('connect')
      socket.off('room_restarted')
      socket.off('room_forfeited');
      listenersAttached.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, store, authUser, roomCode])

  const roomCodeRef = useRef(roomCode)
  const currentQuestionRef = useRef(store.currentQuestion)
  const hasAnsweredRef = useRef(hasAnswered)

  useEffect(() => { roomCodeRef.current = roomCode }, [roomCode])
  useEffect(() => { currentQuestionRef.current = store.currentQuestion }, [store.currentQuestion])
  useEffect(() => { hasAnsweredRef.current = hasAnswered }, [hasAnswered])

  const submitAnswer = useCallback((option: string | null) => {
    const socket = getSocket()
    if (!socket || !socket.connected || hasAnsweredRef.current || !roomCodeRef.current) return

    const timeTaken = Date.now() - startTimeRef.current
    setHasAnswered(true)
    hasAnsweredRef.current = true
    setSelectedOption(option)

    socket.emit('submit_answer', {
      room_code: roomCodeRef.current.toUpperCase(),
      question_number: currentQuestionRef.current,
      selected_option: option,
      time_taken_ms: timeTaken,
    })
  }, [])

  const handleExit = () => {
    const socket = getSocket();
    if (socket && roomCode) {
      socket.emit('leave_room', { room_code: roomCode.toUpperCase() });
    }
    disconnectSocket();
    store.resetGame();
    navigate('/');
  };

  const question = store.questions[0]
  const isNumerical = !question?.options || 
  question.options.length === 0 || 
  question.options.every((opt: any) => !opt.text || opt.text.trim() === '');
  
  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Leave Battle?</h3>
              </div>
              <p className="text-slate-400">{phase === 'finished' ? "Return to lobby? Your results have been saved." : "Leaving forfeits the active battle ranking metrics completely."}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 transition-all font-medium">Stay</button>
                <button onClick={handleExit} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"><LogOut className="w-4 h-4" /> Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ UI UPGRADE: Premium glassmorphic header */}
      <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Swords className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Active Room</span>
            <span className="font-mono font-bold text-slate-200 tracking-wider">{roomCode}</span>
          </div>
        </div>
        <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-white/5 transition-all text-sm font-medium">
          <LogOut className="w-4 h-4" /> Exit
        </button>
      </div>

      {disconnected && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 flex items-center gap-3 text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" /> Re-linking system channels...
        </div>
      )}

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-center font-medium backdrop-blur-sm"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'playing' && question && (
          <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Question {store.currentQuestion} <span className="text-slate-600">/</span> {store.totalQuestions}
              </span>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold border transition-all", 
                store.timeRemaining <= 10 ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" : "bg-slate-900 text-slate-300 border-white/10"
              )}>
                <Clock className="w-4 h-4" /> {store.timeRemaining}s
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm shadow-lg">
              <MathHtml html={question.question_text} className="text-lg font-medium leading-relaxed text-slate-200" />
            </div>

            {isNumerical ? (
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                <label className="block text-sm font-semibold text-slate-300">Enter Integer / Numerical Answer:</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    disabled={hasAnswered}
                    value={numericalInput}
                    onChange={(e) => setNumericalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && numericalInput.trim() && !hasAnswered) {
                        submitAnswer(numericalInput.trim())
                      }
                    }}
                    placeholder="e.g. 3, 15, -2"
                    className="flex-1 max-w-xs px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-lg font-mono text-center text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                  />
                  {!hasAnswered && (
                    <button
                      onClick={() => submitAnswer(numericalInput.trim())}
                      disabled={!numericalInput.trim()}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {question.options?.map((opt: any) => (
                  <button 
                    key={opt.id} 
                    onClick={() => !hasAnswered && submitAnswer(opt.id)} 
                    disabled={hasAnswered} 
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all duration-200 relative group", 
                      hasAnswered 
                        ? (selectedOption === opt.id ? "border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/10" : "border-white/5 opacity-40") 
                        : "border-white/5 bg-slate-900/30 hover:border-white/10 hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all", 
                        selectedOption === opt.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                      )}>
                        {opt.id}
                      </span>
                      <MathHtml html={opt.text} className="flex-1 text-slate-200" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {hasAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-indigo-300 font-medium">
                  <Zap className="w-5 h-5" /> Answer submitted! Waiting for others...
                </div>
                {answerResult && (
                  <div className="mt-2 text-sm text-slate-400 font-mono">
                    Score: +{answerResult.score_gained} (Total: {answerResult.total_score})
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'results' && store.questionResults && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3 text-slate-100">Question Results</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 font-medium">
                <Target className="w-4 h-4" /> Correct Option: {store.questionResults.correct_option}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
              <MathHtml html={store.questionResults.explanation || ''} className="text-slate-300 text-sm leading-relaxed" />
            </div>
            <div className="space-y-2">
              {store.questionResults.player_results?.map((p: any, i: number) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all", 
                  p.is_correct ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                )}>
                  <div className="flex items-center gap-3">
                    {p.is_correct ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span className="font-medium text-slate-200">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-300">+{p.score_gained}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-slate-100">
                <Trophy className="w-6 h-6 text-yellow-400" /> Standings
              </h2>
              <p className="text-slate-400 font-medium">Next drop incoming in <span className="text-indigo-400 font-mono text-lg">{nextQuestionIn}s</span></p>
            </div>
            <div className="space-y-3">
              {leaderboard.map((p: any, i: number) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border flex justify-between items-center transition-all",
                  i === 0 ? "bg-yellow-500/5 border-yellow-500/20" :
                  i === 1 ? "bg-slate-400/5 border-slate-400/20" :
                  i === 2 ? "bg-orange-500/5 border-orange-500/20" :
                  "bg-slate-900/50 border-white/5"
                )}>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                      i === 1 ? "bg-slate-400/20 text-slate-300" :
                      i === 2 ? "bg-orange-500/20 text-orange-400" :
                      "bg-slate-800 text-slate-400"
                    )}>
                      {p.rank}
                    </span>
                    <span className="font-medium text-slate-200">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-400">{p.total_score} pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
              <Crown className="text-white w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Battle Complete</h2>
            <div className="space-y-3 text-left">
              {finalRankings.map((p: any) => (
                <div key={p.user_id} className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", p.rank === 1 ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-800 text-slate-400")}>{p.rank}</span>
                    {p.name}
                  </span>
                  <span className="font-bold text-indigo-400 font-mono">{p.total_score} pts</span>
                </div>
              ))}
            </div>
            
            {store.isHost ? (
              <button 
                onClick={() => {
                  const socket = getSocket();
                  if (socket && roomCode) {
                    socket.emit('restart_room', { room_code: roomCode.toUpperCase() });
                  }
                }} 
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 transition-all font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:scale-[1.01]"
              >
                Play Again (Same Room)
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 font-medium flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                Waiting for host to start a new game...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    
      <AnimatePresence>
        {forfeitMessage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="bg-slate-900 border border-red-500/30 p-8 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Match Forfeited</h2>
              <p className="text-slate-400">{forfeitMessage}</p>
              <button 
                onClick={() => {
                  disconnectSocket();
                  store.resetGame();
                  navigate('/', { replace: true });
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>  
    </div>
  )
}