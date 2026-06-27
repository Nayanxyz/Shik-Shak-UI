import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Swords,  Target, Users, Clock, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

const features = [
  { icon: <Brain className="w-6 h-6" />, title: 'AI-Powered Questions', desc: 'Groq LLM generates fresh JEE/NEET MCQs every time' },
  { icon: <Target className="w-6 h-6" />, title: 'Smart Validation', desc: 'Math/Physics checked with SymPy, Chemistry with PubChem' },
  { icon: <Users className="w-6 h-6" />, title: 'Live Battles', desc: 'Compete with up to 4 players in real-time' },
  { icon: <Clock className="w-6 h-6" />, title: 'Time Bonuses', desc: 'Answer fast for extra points — speed matters!' },
]

const subjects = [
  { id: 'MATH', name: 'Mathematics', color: 'from-blue-500 to-cyan-500', icon: '∫', bg: 'from-blue-500/10 to-cyan-500/10' },
  { id: 'PHYSICS', name: 'Physics', color: 'from-orange-500 to-red-500', icon: '⚡', bg: 'from-orange-500/10 to-red-500/10' },
  { id: 'CHEMISTRY', name: 'Chemistry', color: 'from-green-500 to-emerald-500', icon: '⚗️', bg: 'from-green-500/10 to-emerald-500/10' },
  { id: 'BIOLOGY', name: 'Biology', color: 'from-pink-500 to-rose-500', icon: '🧬', bg: 'from-pink-500/10 to-rose-500/10' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Nayanxyz
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Shik-Shak Arena
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The ultimate competitive exam battleground. Practice solo or battle friends with AI-generated JEE/NEET questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            >
              <Brain className="w-5 h-5" />
              Start Practice
            </button>
            <button
              onClick={() => navigate('/battle/lobby')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            >
              <Swords className="w-5 h-5" />
              Battle Arena
            </button>
          </div>
        </motion.div>
      </section>

      {/* Subjects */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((s, i) => (
            <motion.button
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('/practice', { state: { selectedSubject: s.id } })}
              // FIX: Use proper bg gradient classes instead of broken string manipulation
              className={cn(
                "p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:scale-105 text-left group",
                "bg-gradient-to-br",
                s.bg
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4", s.color)}>
                {s.icon}
              </div>
              <h3 className="font-bold text-lg">{s.name}</h3>
              <p className="text-slate-400 text-sm mt-1">JEE/NEET level</p>
              <ChevronRight className="w-5 h-5 mt-4 text-slate-500 group-hover:text-white transition-colors" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              {f.icon}
            </div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Banner */}
      <section className="py-8 px-6 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Questions Generated', value: '∞', sub: 'AI-powered' },
            { label: 'Subjects', value: '4', sub: 'Math, Physics, Chem, Bio' },
            { label: 'Battle Players', value: '4', sub: 'Max per room' },
            { label: 'Time Limit', value: '60s', sub: 'Per question' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-indigo-300">{stat.value}</div>
              <div className="text-sm font-medium mt-1">{stat.label}</div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}