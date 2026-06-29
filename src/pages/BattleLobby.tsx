import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Users, Clock, Plus, LogIn, Copy, Check, LogOut, Crown, UserX, RefreshCw, AlertCircle, Zap, BookOpen, Dices } from 'lucide-react'
import { cn } from '../lib/utils'
import { getSocket, disconnectSocket } from '../lib/socket'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'

const SUBJECTS = ['MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY'] as const
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
};

function getRandomChapters(subject: string, count: number = 5): string[] {
  const chapters = MASTER_CHAPTER_DATABASE[subject];
  if (!chapters || chapters.length < count) return [];
  const shuffled = [...chapters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(c => c.id);
}

export default function BattleLobby() {
  const navigate = useNavigate();
  const store = useGameStore();
  const authUser = useAuthStore((s) => s.user);

  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [subject, setSubject] = useState('MATH');
  const [difficulty, setDifficulty] = useState('LOW');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [playerName, setPlayerName] = useState(authUser?.username || '');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const listenersAttached = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    if (listenersAttached.current) return;
    listenersAttached.current = true;

    socket.on('room_created', (data: any) => {
      console.log('RECEIVED room_created:', data);
      store.setRoom(data);
      store.setConnected(true);
      setIsConnecting(false);
    });

    socket.on('questions_ready', () => {
      setQuestionsReady(true);
    });

    socket.on('room_joined', (data: any) => {
      store.setRoom(data);
      store.setConnected(true);
      setIsConnecting(false);
    });

    socket.on('player_joined', (data: any) => {
      store.setPlayers(data.players);
    });

    socket.on('player_left', (data: any) => {
      store.setPlayers(data.players);
      // Replaces alert()
      setPopupMessage("A player has left the room.");
    });

    socket.on('player_left_notification', (data: any) => {
      // Replaces alert()
      setPopupMessage(data.message);
    });

    socket.on('kicked', () => {
      store.setRoom(null);
      store.setPlayers([]);
      store.setConnected(false);
      setError('You were kicked from the room');
      setTimeout(() => navigate('/battle/lobby'), 2000);
    });

    socket.on('left_room', () => {
      store.setRoom(null);
      store.setPlayers([]);
      store.setConnected(false);
      navigate('/battle/lobby');
    });

    socket.on('game_starting', (data: any) => {
      navigate(`/battle/game/${data.room_code}`);
    });

    socket.on('error', (data: any) => {
      setError(data.message);
      setIsConnecting(false);
    });

    socket.on('room_forfeited', (data: any) => {
      alert(data.message);
      disconnectSocket();
      store.setRoom(null); // Use store.setRoom(null) if setRoomCode throws an error
      store.resetGame();
      navigate('/', { replace: true });
    });

    socket.on('connect', () => setDisconnected(false));
    socket.on('disconnect', () => setDisconnected(true));

    if (socket.connected) {
      setDisconnected(false);
    }

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('questions_ready');
      socket.off('kicked');
      socket.off('left_room');
      socket.off('game_starting');
      socket.off('error');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room_forfeited');
      listenersAttached.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const socket = getSocket();
  //   if (!socket.connected) {
  //     socket.connect();
  //   }
  // }, []);

  useEffect(() => {
    if (!store.roomCode) {
      setMode('menu');
      setSelectedChapters([]);
      setJoinCode('');
      setError('');
      setQuestionsReady(false);
    }
  }, [store.roomCode]);

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const randomizeChapters = () => {
    const random = getRandomChapters(subject, 5);
    setSelectedChapters(random);
  };

  const createRoom = () => {
    console.log('EMITTING create_room')
    if (selectedChapters.length !== 5 || !playerName.trim()) return;
    setIsConnecting(true);
    setError('');
    setQuestionsReady(false);

    const socket = getSocket();
    const chapterMix = selectedChapters.map(id => {
      const ch = MASTER_CHAPTER_DATABASE[subject].find(c => c.id === id);
      return { id, name: ch?.name || id };
    });

    console.log('EMITTING create_room:', { subject, difficulty, chapter_mix: chapterMix, player_name: playerName.trim(), user_id: authUser?.id });

    socket.emit('create_room', {
      subject,
      difficulty,
      chapter_mix: chapterMix,
      player_name: playerName.trim(),
      max_players: maxPlayers,
      time_per_question: timePerQuestion,
      user_id: authUser?.id || `guest_${Math.random().toString(36).slice(2, 10)}`
    });
  };

  const joinRoom = () => {
    if (!joinCode.trim() || !playerName.trim()) return;
    setIsConnecting(true);
    setError('');

    const socket = getSocket();
    socket.emit('join_room', {
      room_code: joinCode.trim().toUpperCase(),
      player_name: playerName.trim(),
      user_id: authUser?.id
    });
  };

  const leaveRoom = () => {
    const socket = getSocket();
    if (socket && store.roomCode) {
      socket.emit('leave_room', { room_code: store.roomCode });
    }
    disconnectSocket();
    store.setRoom(null); 
    store.resetGame();
    setShowExitConfirm(false);
    navigate('/'); // Escape to home, breaking the mount loop
  };

  const kickPlayer = (targetSid: string) => {
    const socket = getSocket();
    if (socket && store.isHost) {
      socket.emit('kick_player', { target_sid: targetSid });
    }
  };

  const copyCode = () => {
    if (store.roomCode) {
      navigator.clipboard.writeText(store.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startGame = () => {
    const socket = getSocket();
    if (socket && store.isHost && store.roomCode) {
      socket.emit('start_game', { room_code: store.roomCode });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Leave Room?</h3>
              </div>
              <p className="text-slate-400">If you leave now, you'll exit the room and lose your spot.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all font-medium">Stay</button>
                <button onClick={leaveRoom} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-all font-medium flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {popupMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
              
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white">Notice</h3>
              <p className="text-slate-400">{popupMessage}</p>
              
              <button 
                onClick={() => setPopupMessage('')} 
                className="w-full py-3 mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all font-medium text-white"
              >
                Got it
              </button>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Battle Arena</h1>
        <p className="text-slate-400">Create a room or join an existing battle</p>
        {disconnected && (
          <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Reconnecting to server...
          </div>
        )}
      </div>

      {mode === 'menu' && !store.roomCode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setMode('create')} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all hover:scale-[1.02] text-left group">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
              <Plus className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create Room</h3>
            <p className="text-slate-400">Host a new battle and invite friends</p>
          </button>
          <button onClick={() => setMode('join')} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all hover:scale-[1.02] text-left group">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <LogIn className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Join Room</h3>
            <p className="text-slate-400">Enter a room code to join a battle</p>
          </button>
        </motion.div>
      )}

      {mode === 'create' && !store.roomCode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white text-sm">← Back</button>
          <div>
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your name" className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => { setSubject(s); setSelectedChapters([]) }} className={cn("p-4 rounded-xl border transition-all text-left", subject === s ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 bg-slate-900 hover:border-slate-600")}><BookOpen className="w-5 h-5 mb-2" /><div className="font-semibold">{s}</div></button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Difficulty</h3>
            <div className="flex gap-3">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={cn("flex-1 p-4 rounded-xl border transition-all", difficulty === d ? (d === 'LOW' ? "border-green-500 bg-green-500/20 text-green-300" : "border-red-500 bg-red-500/20 text-red-300") : "border-slate-700 bg-slate-900 hover:border-slate-600")}><Zap className="w-5 h-5 mb-2" /><div className="font-semibold">{d === 'LOW' ? 'Foundation' : 'Advanced'}</div></button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Chapters ({selectedChapters.length}/5)</h3>
              <button onClick={randomizeChapters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"><Dices className="w-4 h-4" />Random 5</button>
            </div>
            <div className="grid md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
              {MASTER_CHAPTER_DATABASE[subject].map(ch => (
                <button key={ch.id} onClick={() => toggleChapter(ch.id)} className={cn("p-3 rounded-lg border text-left text-sm transition-all", selectedChapters.includes(ch.id) ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 bg-slate-900 hover:border-slate-600")}><div className="flex items-center gap-2"><div className={cn("w-5 h-5 rounded border flex items-center justify-center text-xs shrink-0", selectedChapters.includes(ch.id) ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-600")}>{selectedChapters.includes(ch.id) && '✓'}</div><span className="truncate">{ch.name}</span></div></button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Max Players</label>
              <div className="flex items-center gap-3 mt-2">
                <Users className="w-5 h-5 text-slate-500" />
                <input type="range" min="2" max="4" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} className="flex-1" />
                <span className="w-8 text-center font-mono">{maxPlayers}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Time per Q</label>
              <div className="flex items-center gap-3 mt-2">
                <Clock className="w-5 h-5 text-slate-500" />
                <input type="range" min="30" max="120" step="10" value={timePerQuestion} onChange={e => setTimePerQuestion(Number(e.target.value))} className="flex-1" />
                <span className="w-12 text-center font-mono">{timePerQuestion}s</span>
              </div>
            </div>
          </div>
          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <button onClick={createRoom} disabled={selectedChapters.length !== 5 || !playerName.trim() || isConnecting} className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2", selectedChapters.length === 5 && playerName.trim() && !isConnecting ? "bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02]" : "bg-slate-800 text-slate-500 cursor-not-allowed")}>{isConnecting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Swords className="w-5 h-5" /> Create Battle Room</>}</button>
        </motion.div>
      )}

      {mode === 'join' && !store.roomCode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-md mx-auto">
          <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white text-sm">← Back</button>
          <div>
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your name" className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Room Code</label>
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. ABC123" maxLength={6} className="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-lg tracking-widest text-center uppercase" />
          </div>
          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <button onClick={joinRoom} disabled={!joinCode.trim() || !playerName.trim() || isConnecting} className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2", joinCode.trim() && playerName.trim() && !isConnecting ? "bg-purple-600 hover:bg-purple-500 hover:scale-[1.02]" : "bg-slate-800 text-slate-500 cursor-not-allowed")}>{isConnecting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-5 h-5" /> Join Battle</>}</button>
        </motion.div>
      )}

      {store.roomCode && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-2"><Swords className="w-4 h-4" /> {store.mode} MODE</div>
              <h2 className="text-2xl font-bold">Room: {store.roomCode}</h2>
              <p className="text-slate-400 mt-1">{store.subject} • {store.difficulty}</p>
            </div>
            <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 border border-slate-700 transition-all text-sm shrink-0 ml-4"><LogOut className="w-4 h-4" /> Leave</button>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-2xl tracking-[0.3em]">{store.roomCode}</div>
            <button onClick={copyCode} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">{copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}</button>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-slate-400" /> Players ({store.players.length})</h3>
            <div className="space-y-2">
              {store.players.map((p: any) => (
                <div key={p.sid} className={cn("flex items-center justify-between p-3 rounded-xl border", p.is_host ? "bg-yellow-500/10 border-yellow-500/30" : "bg-slate-800/50 border-slate-700")}><div className="flex items-center gap-3"><div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold", p.is_host ? "bg-yellow-500 text-yellow-950" : "bg-slate-700")}>{p.is_host ? <Crown className="w-5 h-5" /> : p.name[0]}</div><div><div className="font-medium flex items-center gap-2">{p.name}{p.is_host && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">Host</span>}{!p.is_connected && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">Disconnected</span>}</div></div></div>{store.isHost && !p.is_host && p.is_connected && <button onClick={() => kickPlayer(p.sid)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors" title="Kick player"><UserX className="w-4 h-4" /></button>}</div>
              ))}
            </div>
          </div>
          {store.isHost ? (
            <button onClick={startGame} disabled={!questionsReady} className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2", questionsReady ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 text-slate-400 cursor-not-allowed")}>{questionsReady ? <><Swords className="w-5 h-5" /> Start Battle</> : <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Questions...</>}</button>
          ) : (
            <div className="text-center p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">Waiting for host to start the battle...</div>
          )}
        </motion.div>
      )}
    </div>
  )
}