import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Swords, Target, Users, Clock, ChevronRight, Sparkles, Sigma, Atom, FlaskConical, Dna } from 'lucide-react'
import { cn } from '../lib/utils'

const features = [
  { icon: <Brain className="w-5 h-5" />, title: 'AI-Powered Questions', desc: 'Shik Shak LLM generates fresh JEE/NEET MCQs dynamically.' },
  { icon: <Target className="w-5 h-5" />, title: 'Smart Validation', desc: 'Math/Physics checked with SymPy, Chemistry with PubChem.' },
  { icon: <Users className="w-5 h-5" />, title: 'Live Battles', desc: 'Compete with up to 4 players in real-time arenas.' },
  { icon: <Clock className="w-5 h-5" />, title: 'Timely Practice', desc: 'Time is of the essence. Experience the real exam rush.' },
]

const subjects = [
  { id: 'MATH', name: 'Mathematics', color: 'from-blue-500 to-cyan-500', icon: <Sigma className="w-6 h-6 text-white" />, bg: 'from-blue-500/10 to-cyan-500/10', border: 'group-hover:border-blue-400' },
  { id: 'PHYSICS', name: 'Physics', color: 'from-orange-500 to-red-500', icon: <Atom className="w-6 h-6 text-white" />, bg: 'from-orange-500/10 to-red-500/10', border: 'group-hover:border-orange-400' },
  { id: 'CHEMISTRY', name: 'Chemistry', color: 'from-green-500 to-emerald-500', icon: <FlaskConical className="w-6 h-6 text-white" />, bg: 'from-green-500/10 to-emerald-500/10', border: 'group-hover:border-green-400' },
  { id: 'BIOLOGY', name: 'Biology', color: 'from-pink-500 to-rose-500', icon: <Dna className="w-6 h-6 text-white" />, bg: 'from-pink-500/10 to-rose-500/10', border: 'group-hover:border-pink-400' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    // ✨ UI UPGRADE: Light mode base with subtle dot pattern
    <div className="space-y-20 pb-12 bg-dot-pattern min-h-screen">
      {/* Hero */}
      <section className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shik-Shak Arena
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate competitive exam battleground. Practice solo or battle friends with AI-generated JEE/NEET questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              <Brain className="w-5 h-5" />
              Start Practice
            </button>
            <button
              onClick={() => navigate('/battle/lobby')}
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-sm"
            >
              <Swords className="w-5 h-5 text-slate-700" />
              Battle Arena
            </button>
          </div>
        </motion.div>
      </section>

      {/* Subjects */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8 tracking-tight text-slate-900">Choose Your Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((s, i) => (
            <motion.button
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('/practice', { state: { selectedSubject: s.id } })}
              className={cn(
                "group p-6 rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left",
                s.border
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm", s.color)}>
                {s.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{s.name}</h3>
              <p className="text-slate-500 text-sm mt-1">JEE/NEET level</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                Start practicing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
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
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              {f.icon}
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">{f.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Banner */}
      <section className="py-10 px-6 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Questions Generated', value: '∞', sub: 'AI-powered' },
            { label: 'Subjects', value: '4', sub: 'Math, Physics, Chem, Bio' },
            { label: 'Battle Players', value: '4', sub: 'Max per room' },
            { label: 'Time Limit', value: '60s', sub: 'Per question' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-sm font-semibold mt-1 text-slate-900">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          Crafted with precision by Nayanxyz
        </div>
      </footer>
    </div>
  )
}