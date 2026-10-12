import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Swords, Users, Clock, Plus, LogIn, Copy, Check, LogOut, Crown, UserX, 
  RefreshCw, AlertCircle, Zap, BookOpen, Dices, Sigma, Atom, FlaskConical, Dna, XCircle
} from 'lucide-react'
import { cn } from '../lib/utils'
import { getSocket, disconnectSocket } from '../lib/socket'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { useSeasonTheme } from '../lib/seasonTheme'
import InviteFriendsModal from '../components/InviteFriendsModal'
import IncomingInvites from '../components/IncomingInvites'


const DIFFICULTIES = ['LOW', 'HIGH'] as const

const MASTER_CHAPTER_DATABASE: Record<string, { id: string; name: string }[]> = {
  MATH: [
    {"id": "M1101", "name": "Sets, Relations and Functions"},
    {"id": "M1102", "name": "Trigonometric Functions"},
    {"id": "M1103", "name": "Complex Numbers and Quadratic Equations"},
    {"id": "M1104", "name": "Linear Inequalities"},
    {"id": "M1105", "name": "Permutations and Combinations"},
    {"id": "M1106", "name": "Binomial Theorem"},
    {"id": "M1107", "name": "Sequences and Series"},
    {"id": "M1108", "name": "Straight Lines"},
    {"id": "M1109", "name": "Conic Sections"},
    {"id": "M1110", "name": "Introduction to Three-Dimensional Geometry"},
    {"id": "M1111", "name": "Limits and Derivatives"},
    {"id": "M1112", "name": "Statistics and Probability"},
    {"id": "M1201", "name": "Inverse Trigonometric Functions"},
    {"id": "M1202", "name": "Matrices and Determinants"},
    {"id": "M1203", "name": "Continuity and Differentiability"},
    {"id": "M1204", "name": "Application of Derivatives"},
    {"id": "M1205", "name": "Integrals (Definite and Indefinite)"},
    {"id": "M1206", "name": "Application of Integrals"},
    {"id": "M1207", "name": "Differential Equations"},
    {"id": "M1208", "name": "Vector Algebra"},
    {"id": "M1209", "name": "Three-Dimensional Geometry (Vectors)"},
    {"id": "M1210", "name": "Linear Programming"},
    {"id": "M1211", "name": "Probability (Advanced)"}
  ],
  PHYSICS: [
    {"id": "P1101", "name": "Units and Measurements"},
    {"id": "P1102", "name": "Motion in a Straight Line"},
    {"id": "P1103", "name": "Motion in a Plane (Vectors & Projectiles)"},
    {"id": "P1104", "name": "Laws of Motion and Friction"},
    {"id": "P1105", "name": "Work, Energy and Power"},
    {"id": "P1106", "name": "System of Particles and Rotational Motion"},
    {"id": "P1107", "name": "Gravitation"},
    {"id": "P1108", "name": "Mechanical Properties of Solids"},
    {"id": "P1109", "name": "Mechanical Properties of Fluids"},
    {"id": "P1110", "name": "Thermal Properties of Matter"},
    {"id": "P1111", "name": "Thermodynamics"},
    {"id": "P1112", "name": "Kinetic Theory of Gases"},
    {"id": "P1113", "name": "Oscillations (SHM)"},
    {"id": "P1114", "name": "Waves and Acoustics"},
    {"id": "P1201", "name": "Electric Charges and Fields"},
    {"id": "P1202", "name": "Electrostatic Potential and Capacitance"},
    {"id": "P1203", "name": "Current Electricity"},
    {"id": "P1204", "name": "Moving Charges and Magnetism"},
    {"id": "P1205", "name": "Magnetism and Matter"},
    {"id": "P1206", "name": "Electromagnetic Induction"},
    {"id": "P1207", "name": "Alternating Current"},
    {"id": "P1208", "name": "Electromagnetic Waves"},
    {"id": "P1209", "name": "Ray Optics and Optical Instruments"},
    {"id": "P1210", "name": "Wave Optics (Interference & Diffraction)"},
    {"id": "P1211", "name": "Dual Nature of Radiation and Matter"},
    {"id": "P1212", "name": "Atoms and Nuclei"},
    {"id": "P1213", "name": "Semiconductor Electronics: Materials and Devices"}
  ],
  CHEMISTRY: [
    {"id": "C1101", "name": "Some Basic Concepts of Chemistry (Mole Concept)"},
    {"id": "C1102", "name": "Structure of Atom"},
    {"id": "C1103", "name": "Classification of Elements and Periodicity"},
    {"id": "C1104", "name": "Chemical Bonding and Molecular Structure"},
    {"id": "C1105", "name": "Chemical Thermodynamics"},
    {"id": "C1106", "name": "Equilibrium (Chemical and Ionic)"},
    {"id": "C1107", "name": "Redox Reactions"},
    {"id": "C1108", "name": "Organic Chemistry: Some Basic Principles and Techniques (GOC)"},
    {"id": "C1109", "name": "Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)"},
    {"id": "C1201", "name": "Solutions"},
    {"id": "C1202", "name": "Electrochemistry"},
    {"id": "C1203", "name": "Chemical Kinetics"},
    {"id": "C1204", "name": "The d- and f-Block Elements"},
    {"id": "C1205", "name": "Coordination Compounds"},
    {"id": "C1206", "name": "Haloalkanes and Haloarenes"},
    {"id": "C1207", "name": "Alcohols, Phenols and Ethers"},
    {"id": "C1208", "name": "Aldehydes, Ketones and Carboxylic Acids"},
    {"id": "C1209", "name": "Amines (Organic Compounds Containing Nitrogen)"},
    {"id": "C1210", "name": "Biomolecules"}
  ],
  BIOLOGY: [
    {"id": "B1101", "name": "The Living World and Biological Classification"},
    {"id": "B1102", "name": "Plant Kingdom"},
    {"id": "B1103", "name": "Animal Kingdom"},
    {"id": "B1104", "name": "Morphology and Anatomy of Flowering Plants"},
    {"id": "B1105", "name": "Structural Organisation in Animals"},
    {"id": "B1106", "name": "Cell: The Unit of Life"},
    {"id": "B1107", "name": "Biomolecules (Biological aspect)"},
    {"id": "B1108", "name": "Cell Cycle and Cell Division"},
    {"id": "B1109", "name": "Photosynthesis in Higher Plants"},
    {"id": "B1110", "name": "Respiration in Plants"},
    {"id": "B1111", "name": "Plant Growth and Development"},
    {"id": "B1112", "name": "Breathing and Exchange of Gases"},
    {"id": "B1113", "name": "Body Fluids and Circulation"},
    {"id": "B1114", "name": "Excretory Products and their Elimination"},
    {"id": "B1115", "name": "Locomotion and Movement"},
    {"id": "B1116", "name": "Neural Control and Coordination"},
    {"id": "B1117", "name": "Chemical Coordination and Integration"},
    {"id": "B1201", "name": "Sexual Reproduction in Flowering Plants"},
    {"id": "B1202", "name": "Human Reproduction and Reproductive Health"},
    {"id": "B1203", "name": "Principles of Inheritance and Variation (Genetics I)"},
    {"id": "B1204", "name": "Molecular Basis of Inheritance (Genetics II)"},
    {"id": "B1205", "name": "Evolution"},
    {"id": "B1206", "name": "Human Health and Disease"},
    {"id": "B1207", "name": "Microbes in Human Welfare"},
    {"id": "B1208", "name": "Biotechnology: Principles and Processes"},
    {"id": "B1209", "name": "Biotechnology and its Applications"},
    {"id": "B1210", "name": "Organisms and Populations"},
    {"id": "B1211", "name": "Ecosystem"},
    {"id": "B1212", "name": "Biodiversity and Conservation"}
  ]
}

function getRandomChapters(subject: string, count: number = 5): string[] {
  const chapters = MASTER_CHAPTER_DATABASE[subject]
  if (!chapters || chapters.length < count) return []
  const shuffled = [...chapters].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(c => c.id)
}

export default function BattleLobby() {
  const navigate = useNavigate()
  const store = useGameStore()
  const authUser = useAuthStore((s) => s.user)
  const T = useSeasonTheme()

  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu')
  const [subject, setSubject] = useState('MATH')
  const [difficulty, setDifficulty] = useState('LOW')
  const [gameType, setGameType] = useState<'AI' | 'PYQ' | 'MOCK'>('AI')
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const AVAILABLE_YEARS = [2023, 2022, 2021, 2020, 2019]
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [timePerQuestion, setTimePerQuestion] = useState(60)
  const [playerName, setPlayerName] = useState(authUser?.username || '')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [disconnected, setDisconnected] = useState(false)
  const [questionsReady, setQuestionsReady] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const listenersAttached = useRef(false)

  useEffect(() => {
    const socket = getSocket()
    if (listenersAttached.current) return
    listenersAttached.current = true

    socket.on('room_created', (data: any) => { store.setRoom(data); store.setConnected(true); setIsConnecting(false) })
    socket.on('questions_ready', () => setQuestionsReady(true))
    socket.on('room_joined', (data: any) => { store.setRoom(data); store.setConnected(true); setIsConnecting(false) })
    socket.on('player_joined', (data: any) => store.setPlayers(data.players))
    socket.on('player_left', (data: any) => { store.setPlayers(data.players); setPopupMessage("A player has left the room.") })
    socket.on('player_left_notification', (data: any) => setPopupMessage(data.message))
    socket.on('kicked', () => { store.setRoom(null); store.setPlayers([]); store.setConnected(false); setError('You were kicked from the room'); setTimeout(() => navigate('/battle/lobby'), 2000) })
    socket.on('left_room', () => { store.setRoom(null); store.setPlayers([]); store.setConnected(false); navigate('/battle/lobby') })
    socket.on('game_starting', (data: any) => navigate(`/battle/game/${data.room_code}`))
    socket.on('error', (data: any) => { setError(data.message); setIsConnecting(false) })
    socket.on('room_forfeited', (data: any) => { setPopupMessage(data.message); disconnectSocket(); store.setRoom(null); store.resetGame(); navigate('/', { replace: true }) })
    socket.on('player_kicked', (data: any) => { store.setPlayers(data.players); setPopupMessage("Player was removed from the room.") })
    socket.on('connect', () => setDisconnected(false))
    socket.on('disconnect', () => setDisconnected(true))

    if (socket.connected) setDisconnected(false)

    return () => {
      socket.off('room_created'); socket.off('room_joined'); socket.off('player_joined')
      socket.off('player_left'); socket.off('questions_ready'); socket.off('kicked')
      socket.off('left_room'); socket.off('game_starting'); socket.off('error')
      socket.off('connect'); socket.off('disconnect'); socket.off('room_forfeited')
      socket.off('player_kicked')
      listenersAttached.current = false
    }
  }, []);

  useEffect(() => {
    if (!store.roomCode) {
      setMode('menu'); setSelectedChapters([]); setJoinCode(''); setError(''); setQuestionsReady(false)
    }
  }, [store.roomCode])

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
    })
  }

  const randomizeChapters = () => setSelectedChapters(getRandomChapters(subject, 5))

  const createRoom = () => {
    if ((gameType !== 'MOCK' && selectedChapters.length !== 5) || !playerName.trim()) return
    setIsConnecting(true); setError(''); setQuestionsReady(false)
    const socket = getSocket()
    const chapterMix = gameType === 'MOCK' ? [] : selectedChapters.map(id => {
      const ch = MASTER_CHAPTER_DATABASE[subject].find(c => c.id === id)
      return { id, name: ch?.name || id }
    })
    socket.emit('create_room', {
      subject, difficulty, chapter_mix: chapterMix, player_name: playerName.trim(),
      max_players: maxPlayers, time_per_question: gameType === 'MOCK' ? 180 : timePerQuestion,
      user_id: authUser?.id || `guest_${Math.random().toString(36).slice(2, 10)}`,
      is_pyq: gameType === 'PYQ', is_mock_3hr: gameType === 'MOCK', years: selectedYears
    })
  }

  const joinRoom = (codeOverride?: string) => {
    const code = (codeOverride || joinCode).trim()
    if (!code || !playerName.trim()) return
    setIsConnecting(true); setError('')
    const socket = getSocket()
    socket.emit('join_room', { room_code: code.toUpperCase(), player_name: playerName.trim(), user_id: authUser?.id })
  }

  const leaveRoom = () => {
    const socket = getSocket()
    if (socket && store.roomCode) socket.emit('leave_room', { room_code: store.roomCode })
    disconnectSocket(); store.setRoom(null); store.resetGame(); setShowExitConfirm(false); navigate('/')
  }

  const kickPlayer = (targetSid: string) => {
    const socket = getSocket()
    if (socket && store.isHost) socket.emit('kick_player', { target_sid: targetSid })
  }

  const copyCode = () => {
    if (store.roomCode) {
      navigator.clipboard.writeText(store.roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const startGame = () => {
    const socket = getSocket()
    if (socket && store.isHost && store.roomCode) socket.emit('start_game', { room_code: store.roomCode })
  }

  const isFormValid = gameType === 'MOCK' ? playerName.trim().length > 0 : playerName.trim().length > 0 && selectedChapters.length === 5

  const inactiveCard = "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-white transition-all duration-200"

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-slate-900">Leave Room?</h3>
              </div>
              <p className="text-slate-600">If you leave now, you'll exit the room and lose your spot.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all font-medium">Stay</button>
                <button onClick={leaveRoom} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all font-medium flex items-center justify-center gap-2 shadow-md shadow-red-500/20"><LogOut className="w-4 h-4" /> Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {popupMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Notice</h3>
              <p className="text-slate-600">{popupMessage}</p>
              <button onClick={() => setPopupMessage('')} className="w-full py-3 mt-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all font-medium text-slate-700">Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <IncomingInvites active={!store.roomCode} onJoin={(c) => joinRoom(c)} />
      <InviteFriendsModal open={showInvite && !!store.roomCode} onClose={() => setShowInvite(false)} roomCode={store.roomCode || ''} />  

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Battle Arena</h1>
        <p className="text-slate-600">Create a room or join an existing battle</p>
        {disconnected && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
            <RefreshCw className="w-4 h-4 animate-spin" /> Reconnecting to server...
          </div>
        )}
      </div>

      {mode === 'menu' && !store.roomCode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setMode('create')} className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left group">
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4", T.iconBg)}>
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Create Room</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Host a new battle, customize settings, and invite friends</p>
          </button>
          <button onClick={() => setMode('join')} className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left group">
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4", T.iconBg)}>
              <LogIn className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Join Room</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Enter a 6-character room code to join a friend's battle</p>
          </button>
        </motion.div>
      )}

      {mode === 'create' && !store.roomCode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <button onClick={() => setMode('menu')} className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-1 transition-colors">← Back to Menu</button>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Your Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your display name"
              className={cn("w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400", T.ring)} />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Battle Mode</h3>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setGameType('AI')} className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200", gameType === 'AI' ? T.chipActive : inactiveCard)}>
                <Zap className="w-5 h-5" /><span className="font-semibold text-sm">AI Quick</span>
              </button>
              <button onClick={() => setGameType('PYQ')} className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200", gameType === 'PYQ' ? T.chipActive : inactiveCard)}>
                <BookOpen className="w-5 h-5" /><span className="font-semibold text-sm">PYQ Battle</span>
              </button>
              <button onClick={() => setGameType('MOCK')} className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200", gameType === 'MOCK' ? T.chipActive : inactiveCard)}>
                <Clock className="w-5 h-5" /><span className="font-semibold text-sm">3-Hour Mock</span>
              </button>
            </div>

            {(gameType === 'PYQ' || gameType === 'MOCK') && (
              <div className="mt-6 p-4 rounded-xl bg-white/60 border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Filter Years</h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_YEARS.map(year => (
                    <button key={year} onClick={() => setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year])}
                      className={cn("px-4 py-2 rounded-lg border text-sm font-medium transition-all", selectedYears.includes(year) ? T.chipActive : inactiveCard)}>
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {gameType !== 'MOCK' && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Subject</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'MATH', icon: <Sigma className="w-5 h-5" /> },
                    { id: 'PHYSICS', icon: <Atom className="w-5 h-5" /> },
                    { id: 'CHEMISTRY', icon: <FlaskConical className="w-5 h-5" /> },
                    { id: 'BIOLOGY', icon: <Dna className="w-5 h-5" /> }
                  ].map(s => (
                    <button key={s.id} onClick={() => { setSubject(s.id); setSelectedChapters([]) }}
                      className={cn("p-4 rounded-xl border transition-all duration-200 text-left", subject === s.id ? T.chipActive : inactiveCard)}>
                      <div className="mb-2 opacity-80">{s.icon}</div>
                      <div className="font-semibold text-sm">{s.id}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Difficulty</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDifficulty(d)}
                      className={cn("p-4 rounded-xl border transition-all duration-200 text-left", difficulty === d ? (d === 'LOW' ? "border-green-400 bg-green-50 text-green-700 shadow-sm" : "border-red-400 bg-red-50 text-red-700 shadow-sm") : inactiveCard)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4" />
                        <div className="font-semibold">{d === 'LOW' ? 'Foundation' : 'Advanced'}</div>
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed">{d === 'LOW' ? 'Class 11th-12th & JEE easy' : 'JEE MAIN & ADVANCED level'}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Chapters ({selectedChapters.length}/5)</h3>
                  <button onClick={randomizeChapters} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", T.btnSoft)}>
                    <Dices className="w-3.5 h-3.5" /> Random 5
                  </button>
                </div>
                <div className="grid gap-2 max-h-80 overflow-y-auto pr-2">
                  {MASTER_CHAPTER_DATABASE[subject].map(ch => (
                    <button key={ch.id} onClick={() => toggleChapter(ch.id)}
                      className={cn("group flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm", selectedChapters.includes(ch.id) ? T.chipActive : "border-slate-200 text-slate-600 hover:bg-white")}>
                      <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0", selectedChapters.includes(ch.id) ? cn(T.solid, "border-transparent") : "border-slate-300 group-hover:border-slate-400")}>
                        {selectedChapters.includes(ch.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="truncate font-medium">{ch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-white/60 border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-3">Max Players</label>
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-slate-500 shrink-0" />
                <input type="range" min="2" max="4" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} className="flex-1 accent-current h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" style={{ color: 'inherit' }} />
                <span className={cn("w-8 text-center font-mono text-lg font-bold", T.text)}>{maxPlayers}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-3">Time per Q</label>
              {gameType === 'MOCK' ? (
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg bg-slate-100 border border-slate-200">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 text-sm font-medium">180s (Fixed for Mock)</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                  <input type="range" min="30" max="120" step="10" value={timePerQuestion} onChange={e => setTimePerQuestion(Number(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                  <span className={cn("w-12 text-center font-mono text-lg font-bold", T.text)}>{timePerQuestion}s</span>
                </div>
              )}
            </div>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

          <button onClick={createRoom} disabled={!isFormValid || isConnecting}
            className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2", isFormValid && !isConnecting ? cn(T.btn, "hover:scale-[1.01]") : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200")}>
            {isConnecting ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Swords className="w-5 h-5" /> Create Battle Room</>}
          </button>

          {isConnecting && (
            <button
              onClick={() => {
                disconnectSocket()
                store.setRoom(null)
                store.resetGame()
                setIsConnecting(false)
                setError('')
                setMode('menu')
              }}
              className="w-full py-3 rounded-xl font-medium text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel Generation
            </button>
          )}
        </motion.div>
      )}

      {mode === 'join' && !store.roomCode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-md mx-auto">
          <button onClick={() => setMode('menu')} className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-1 transition-colors">← Back to Menu</button>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Your Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your display name"
              className={cn("w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400", T.ring)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Room Code</label>
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6}
              className={cn("w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none transition-all font-mono text-2xl tracking-[0.5em] text-center uppercase text-slate-900 placeholder:text-slate-300 placeholder:tracking-normal placeholder:text-base", T.ring)} />
          </div>
          {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <button onClick={() => joinRoom()} disabled={!joinCode.trim() || !playerName.trim() || isConnecting}
            className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2", joinCode.trim() && playerName.trim() && !isConnecting ? cn(T.btn, "hover:scale-[1.01]") : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200")}>
            {isConnecting ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-5 h-5" /> Join Battle</>}
          </button>
        </motion.div>
      )}

      {store.roomCode && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="text-center flex-1">
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-3", T.btnSoft)}>
                <Swords className="w-3.5 h-3.5" /> {store.mode} MODE
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Battle Lobby</h2>
              <p className="text-slate-600 mt-1 text-sm">{store.subject} • {store.difficulty}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowInvite(true)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium', T.btnSoft)}>
                <Users className="w-4 h-4" /> Invite
              </button>
              <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all text-sm font-medium text-slate-600">
                <LogOut className="w-4 h-4" /> Leave
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 relative overflow-hidden shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest relative z-10">Share this code with friends</p>
            <div className="flex items-center gap-4 relative z-10">
              <div className={cn("px-8 py-4 rounded-xl bg-white border font-mono text-3xl tracking-[0.4em] shadow-sm", T.border, T.text)}>
                {store.roomCode}
              </div>
              <button onClick={copyCode} className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all group shadow-sm">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />}
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Users className="w-5 h-5 text-slate-500" />
              Players <span className="text-slate-500 font-normal">({store.players.length} / {maxPlayers})</span>
            </h3>
            <div className="space-y-3">
              {store.players.map((p: any) => (
                <div key={p.sid} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", p.is_host ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200 hover:border-slate-300")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0", p.is_host ? "bg-amber-100 text-amber-700 border border-amber-300" : cn(T.iconBg, "border", T.border))}>
                      {p.is_host ? <Crown className="w-5 h-5" /> : p.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-2 flex-wrap">
                        {p.name}
                        {p.is_host && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">Host</span>}
                        {!p.is_connected && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Offline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {store.isHost && !p.is_host && p.is_connected && (
                    <button onClick={() => kickPlayer(p.sid)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all" title="Kick player">
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {store.isHost ? (
            <button onClick={startGame} disabled={!questionsReady}
              className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2", questionsReady ? cn(T.btn, "hover:scale-[1.01]") : "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-200")}>
              {questionsReady ? (
                <><Swords className="w-5 h-5" /> Start Battle</>
              ) : (
                <><RefreshCw className="w-5 h-5 animate-spin" /> {difficulty === 'HIGH' ? 'Fetching Curated Questions...' : 'Generating Questions...'}</>
              )}
            </button>
          ) : (
            <div className="text-center p-6 rounded-xl bg-white/60 border border-slate-200 text-slate-600 flex flex-col items-center gap-2">
              <RefreshCw className={cn("w-5 h-5 animate-spin", T.text)} />
              <p>Waiting for host to start the battle...</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}