import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, BookOpen, Dices, Zap } from 'lucide-react'
import { cn } from '../lib/utils'
import MathHtml from '../components/MathHtml'
import { apiFetch } from '../lib/api'
import { LogOut, AlertCircle } from 'lucide-react'

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
  return [...chapters].sort(() => Math.random() - 0.5).slice(0, count).map(c => c.id);
}

export default function PracticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'select' | 'loading' | 'playing'>('select');
  const [subject, setSubject] = useState<string>(location.state?.selectedSubject || 'MATH');
  const [difficulty, setDifficulty] = useState<string>('LOW');
  const [isPyqMode, setIsPyqMode] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const AVAILABLE_YEARS = [2023, 2022, 2021, 2020, 2019];
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [session, setSession] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const timerActiveRef = useRef(false);

  const handleSubmit = useCallback(async (option: string | null) => {
    if (!session || showResult) return;
    try {
      const data = await apiFetch('/api/v1/practice/answer', {
        method: 'POST',
        body: JSON.stringify({ session_id: session.session_id, question_number: currentQ + 1, selected_option: option }),
      });
      setResult(data);
      setShowResult(true);
      timerActiveRef.current = false;
    } catch (e) {
      console.error(e);
    }
  }, [session, showResult, currentQ]);

  useEffect(() => {
    if (location.state?.selectedSubject) {
      setSubject(location.state.selectedSubject);
    }
  }, [location.state]);

  useEffect(() => {
    if (step !== 'playing' || showResult) {
      timerActiveRef.current = false;
      return;
    }
    if (timeRemaining <= 0) {
      timerActiveRef.current = false;
      handleSubmit(null);
      return;
    }
    if (timerActiveRef.current) return;
    timerActiveRef.current = true;
    
    const timer = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          clearInterval(timer);
          timerActiveRef.current = false;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
      timerActiveRef.current = false;
    }
  }, [step, showResult, timeRemaining, handleSubmit]);

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => prev.includes(id) ? prev.filter(c => c !== id) : (prev.length >= 5 ? prev : [...prev, id]));
  };

  const randomizeChapters = () => setSelectedChapters(getRandomChapters(subject, 5));

  const startPractice = async () => {
    if (selectedChapters.length !== 5) return;
    setStep('loading');
    setError('');
    try {
      const chapterMix = selectedChapters.map(id => ({ 
        id, 
        name: MASTER_CHAPTER_DATABASE[subject].find(c => c.id === id)?.name || id 
      }));
      
      // Route dynamically to the new PYQ endpoint or standard AI endpoint
      const endpoint = isPyqMode ? '/api/v1/practice/pyq/start' : '/api/v1/practice/start';
      
      const payload = isPyqMode 
        ? { subject, difficulty, chapter_mix: chapterMix, years: selectedYears, limit: 5 }
        : { subject, difficulty, chapter_mix: chapterMix };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      setSession(data);
      setCurrentQ(0);
      setTimeRemaining(60);
      setSelectedOption(null);
      setShowResult(false);
      setStep('playing');
    } catch (e: any) {
      setError(e.message);
      setStep('select');
    }
  };

  const handleLeavePractice = async () => {
    if (!session?.session_id) {
      navigate('/');
      return;
    }

    try {
      await apiFetch('/api/v1/practice/finish', {
        method: 'POST',
        body: JSON.stringify({ session_id: session.session_id }),
      });
    } catch (e) {
      console.error("Failed to finish practice session cleanly:", e);
    } finally {
      setShowExitConfirm(false);
      navigate('/');
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= session.total_questions) {
      navigate('/practice/results', { state: { sessionId: session.session_id } });
      return;
    }
    setCurrentQ(prev => prev + 1);
    setTimeRemaining(60);
    setSelectedOption(null);
    setShowResult(false);
    setResult(null);
  };

  const activeQuestion = session?.questions?.[currentQ];

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Leave Practice?</h3>
              </div>
              <p className="text-slate-400">Your session will end and any unanswered questions will be skipped.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all font-medium">Stay</button>
                <button onClick={handleLeavePractice} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-all font-medium flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
              <p className="text-slate-400">Select your subject, difficulty, and 5 chapters</p>
            </div>

            {/* Mode Selection */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Practice Mode</h3>
              <div className="flex gap-3 mb-6">
                <button onClick={() => setIsPyqMode(false)} className={cn("flex-1 p-4 rounded-xl border transition-all", !isPyqMode ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 bg-slate-900 hover:border-slate-600")}>
                  <div className="font-semibold flex items-center justify-center gap-2"><Brain className="w-4 h-4" /> AI Generated</div>
                </button>
                <button onClick={() => setIsPyqMode(true)} className={cn("flex-1 p-4 rounded-xl border transition-all", isPyqMode ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-slate-700 bg-slate-900 hover:border-slate-600")}>
                  <div className="font-semibold flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Previous Year (PYQ)</div>
                </button>
              </div>
              
              {isPyqMode && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Years (Optional)</h3>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_YEARS.map(year => (
                      <button 
                        key={year} 
                        onClick={() => setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year])}
                        className={cn("px-4 py-2 rounded-lg border text-sm transition-all", selectedYears.includes(year) ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-slate-700 bg-slate-900 text-slate-400")}
                      >
                        {year}
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 self-center ml-2">Leave blank for random years</span>
                  </div>
                </div>
              )}
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
                  <button key={d} onClick={() => setDifficulty(d)} className={cn("flex-1 p-4 rounded-xl border transition-all", difficulty === d ? (d === 'LOW' ? "border-green-500 bg-green-500/20 text-green-300" : "border-red-500 bg-red-500/20 text-red-300") : "border-slate-700 bg-slate-900 hover:border-slate-600")}><Zap className="w-5 h-5 mb-2" /><div className="font-semibold">{d === 'LOW' ? 'Foundation' : 'Advanced'}</div><div className="text-xs text-slate-400 mt-1">{d === 'LOW' ? '2-3 min per question' : '5-8 min per question'}</div></button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Chapters ({selectedChapters.length}/5 selected)</h3>
                <button onClick={randomizeChapters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"><Dices className="w-4 h-4" />Random 5</button>
              </div>
              <div className="grid md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                {MASTER_CHAPTER_DATABASE[subject].map(ch => (
                  <button key={ch.id} onClick={() => toggleChapter(ch.id)} className={cn("p-3 rounded-lg border text-left text-sm transition-all", selectedChapters.includes(ch.id) ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 bg-slate-900 hover:border-slate-600")}><div className="flex items-center gap-2"><div className={cn("w-5 h-5 rounded border flex items-center justify-center text-xs shrink-0", selectedChapters.includes(ch.id) ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-600")}>{selectedChapters.includes(ch.id) && '✓'}</div><span className="truncate">{ch.name}</span></div></button>
                ))}
              </div>
            </div>
            {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}
            <button onClick={startPractice} disabled={selectedChapters.length !== 5} className={cn("w-full py-4 rounded-xl font-semibold text-lg transition-all", selectedChapters.length === 5 ? "bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02]" : "bg-slate-800 text-slate-500 cursor-not-allowed")}>Start Practice Session</button>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-semibold">Generating Questions...</h2>
            <p className="text-slate-400 mt-2">Shik Shak AI is crafting your personalized exam</p>
          </motion.div>
        )}

        {step === 'playing' && activeQuestion && (
          <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400"><Brain className="w-4 h-4" />Question {currentQ + 1} of {session.total_questions}</div>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono", timeRemaining <= 10 ? "bg-red-500/20 text-red-300" : "bg-slate-800")}><Clock className="w-4 h-4" />{timeRemaining}s</div>
                <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 border border-slate-700 transition-all text-sm shrink-0">
                    <LogOut className="w-4 h-4" /> Leave
                </button>
            </div>
            
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / session.total_questions) * 100}%` }} />
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <MathHtml html={activeQuestion.question_text} className="text-lg font-medium leading-relaxed" />
            </div>
            <div className="space-y-3">
              {activeQuestion.options.map((opt: any) => (
                <button key={opt.id} onClick={() => !showResult && setSelectedOption(opt.id)} disabled={showResult} className={cn("w-full p-4 rounded-xl border text-left transition-all", showResult ? (opt.id === result?.correct_option ? "border-green-500 bg-green-500/20" : (opt.id === selectedOption ? "border-red-500 bg-red-500/20" : "border-slate-800 opacity-50")) : (selectedOption === opt.id ? "border-indigo-500 bg-indigo-500/20" : "border-slate-700 hover:border-slate-600 hover:bg-slate-900"))}>
                  <div className="flex items-center gap-3">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0", showResult ? (opt.id === result?.correct_option ? "bg-green-500 text-white" : (opt.id === selectedOption ? "bg-red-500 text-white" : "bg-slate-800")) : (selectedOption === opt.id ? "bg-indigo-500 text-white" : "bg-slate-800"))}>{opt.id}</span><MathHtml html={opt.text} />
                  </div>
                </button>
              ))}
            </div>
            {!showResult ? (
              <button onClick={() => handleSubmit(selectedOption)} disabled={!selectedOption} className={cn("w-full py-4 rounded-xl font-semibold transition-all", selectedOption ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-800 text-slate-500 cursor-not-allowed")}>Submit Answer</button>
            ) : (
              <div className="space-y-4">
                <div className={cn("p-4 rounded-xl border flex items-center gap-3", result?.is_correct ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10")}>
                  {result?.is_correct ? <CheckCircle className="w-6 h-6 text-green-400 shrink-0" /> : <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
                  <div>
                    <div className={cn("font-semibold", result?.is_correct ? "text-green-300" : "text-red-300")}>{result?.is_correct ? `Correct! +${result.score} points` : 'Incorrect (-1 point)'}</div>
                    <MathHtml html={result?.explanation || ''} className="text-sm text-slate-400 mt-1" />
                  </div>
                </div>
                <button onClick={nextQuestion} className="w-full py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">{currentQ + 1 >= session.total_questions ? 'View Results' : 'Next Question'}<ArrowRight className="w-5 h-5" /></button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}