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
      // The server has wiped the scores. Route everyone back to the lobby waiting area.
      navigate('/battle/lobby');
    })

    socket.on('player_left_notification', (data: any) => {
  // Use a state variable like 'notification' to show a banner
       setNotification(data.message);
       setTimeout(() => setNotification(null), 5000); // Hide after 5s
    })

    socket.on('room_forfeited', (data: any) => {
  // Show a "Game Over" screen instead of a browser alert
      setPhase('finished'); 
      setError(data.message);
    })

    socket.on('room_forfeited', (data: any) => {
      setForfeitMessage(data.message);
    // Do NOT navigate here immediately; let the user see the message in the UI
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
    navigate('/'); // Escape to home
  };

  const question = store.questions[0]
  
  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Leave Battle?</h3>
              </div>
              <p className="text-slate-400">{phase === 'finished' ? "Return to lobby? Your results have been saved." : "Leaving forfeits the active battle ranking metrics completely."}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 font-medium">Stay</button>
                <button onClick={handleExit} className="flex-1 py-3 rounded-xl bg-red-600 transition-all font-medium flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Swords className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Room: {roomCode}</span>
        </div>
        <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 transition-all text-sm"><LogOut className="w-4 h-4" /> Exit</button>
      </div>

      {disconnected && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 flex items-center gap-2 text-sm"><RefreshCw className="w-4 h-4 animate-spin" /> Re-linking system channels...</div>
      )}

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-center font-medium"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>


      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">{error}</div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'playing' && question && (
          <motion.div key="playing" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400">Question {store.currentQuestion} / {store.totalQuestions}</span>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm", store.timeRemaining <= 10 ? "bg-red-500/20 text-red-300" : "bg-slate-800")}><Clock className="w-4 h-4" /> {store.timeRemaining}s</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <MathHtml html={question.question_text} className="text-lg font-medium leading-relaxed" />
            </div>
            <div className="space-y-3">
              {question.options.map((opt: any) => (
                <button key={opt.id} onClick={() => !hasAnswered && submitAnswer(opt.id)} disabled={hasAnswered} className={cn("w-full p-4 rounded-xl border text-left transition-all", hasAnswered ? (selectedOption === opt.id ? "border-indigo-500 bg-indigo-500/20" : "border-slate-800 opacity-50") : "border-slate-700 hover:border-indigo-500 hover:bg-slate-900")}><div className="flex items-center gap-3"><span className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0", selectedOption === opt.id ? "bg-indigo-500 text-white" : "bg-slate-800")}>{opt.id}</span><MathHtml html={opt.text} /></div></button>
              ))}
            </div>
            {hasAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <div className="flex items-center justify-center gap-2 text-indigo-300">
                  <Zap className="w-5 h-5" /> Answer submitted! Waiting for others...
                </div>
                {answerResult && (
                  <div className="mt-2 text-sm text-slate-400">
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
              <h2 className="text-2xl font-bold mb-2">Question Results</h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300"><Target className="w-4 h-4" /> Correct Option: {store.questionResults.correct_option}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <MathHtml html={store.questionResults.explanation || ''} className="text-slate-300 text-sm" />
            </div>
            <div className="space-y-2">
              {store.questionResults.player_results?.map((p: any, i: number) => (
                <div key={i} className={cn("flex items-center justify-between p-3 rounded-lg border", p.is_correct ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20")}><div className="flex items-center gap-3">{p.is_correct ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}<span className="font-medium">{p.name}</span></div><span className="font-mono font-bold">+{p.score_gained}</span></div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2"><Trophy className="text-yellow-400" /> Standings</h2>
              <p className="text-slate-400">Next drop incoming in {nextQuestionIn}s</p>
            </div>
            <div className="space-y-2">
              {leaderboard.map((p: any, i: number) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between"><span>{p.rank}. {p.name}</span><span className="font-mono font-bold text-indigo-400">{p.total_score} pts</span></div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"><Crown className="text-white w-8 h-8"/></div>
            <h2 className="text-3xl font-black">Battle Complete</h2>
            <div className="space-y-2 text-left">
              {finalRankings.map((p: any) => (
                <div key={p.user_id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between"><span>{p.rank}. {p.name}</span><span className="font-bold text-indigo-400">{p.total_score} pts</span></div>
              ))}
            </div>
            
            {/* NEW HOST CONTROL LOGIC */}
            {store.isHost ? (
              <button 
                onClick={() => {
                  const socket = getSocket();
                  if (socket && roomCode) {
                    socket.emit('restart_room', { room_code: roomCode.toUpperCase() });
                  }
                }} 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors font-bold rounded-xl"
              >
                Play Again (Same Room)
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-medium">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div className="bg-slate-900 border border-red-500/50 p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Match Forfeited</h2>
              <p className="text-slate-300">{forfeitMessage}</p>
              <button 
                onClick={() => {
                  disconnectSocket();
                  store.resetGame();
                  navigate('/', { replace: true });
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold"
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