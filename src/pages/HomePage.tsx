import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Swords, Target, Users, Clock, ChevronRight, Sparkles, Sigma, Atom, FlaskConical, Dna, Leaf } from 'lucide-react'
import { cn } from '../lib/utils'
import { useSeasonTheme } from '../lib/seasonTheme'

const features = [
  { icon: <Brain className="w-5 h-5" />, title: 'AI-Powered Questions', desc: 'Shik Shak LLM generates fresh JEE/NEET MCQs dynamically.' },
  { icon: <Target className="w-5 h-5" />, title: 'Smart Validation', desc: 'Math/Physics checked with SymPy, Chemistry with PubChem.' },
  { icon: <Users className="w-5 h-5" />, title: 'Live Battles', desc: 'Compete with up to 4 players in real-time arenas.' },
  { icon: <Clock className="w-5 h-5" />, title: 'Timely Practice', desc: 'Time is of the essence. Experience the real exam rush.' },
]

const subjects = [
  { id: 'MATH', name: 'Mathematics', color: 'from-blue-500 to-cyan-500', icon: <Sigma className="w-6 h-6 text-white" />, border: 'group-hover:border-blue-400' },
  { id: 'PHYSICS', name: 'Physics', color: 'from-orange-500 to-red-500', icon: <Atom className="w-6 h-6 text-white" />, border: 'group-hover:border-orange-400' },
  { id: 'CHEMISTRY', name: 'Chemistry', color: 'from-green-500 to-emerald-500', icon: <FlaskConical className="w-6 h-6 text-white" />, border: 'group-hover:border-green-400' },
  { id: 'BIOLOGY', name: 'Biology', color: 'from-pink-500 to-rose-500', icon: <Dna className="w-6 h-6 text-white" />, border: 'group-hover:border-pink-400' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const T = useSeasonTheme()

  return (
    <div className="space-y-20 pb-28 relative">
      {/* Hero */}
      <section className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Leaf className="hidden md:block absolute -left-20 top-8 w-9 h-9 text-emerald-400/70 animate-float-soft rotate-45" />
          <Leaf className="hidden md:block absolute -right-20 top-20 w-6 h-6 text-teal-400/60 animate-float-slower -rotate-12" />

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", T.gradient)}>
              Shik-Shak Arena
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate competitive exam battleground. Practice solo or battle friends with AI-generated JEE/NEET questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className={cn("flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105", T.btn)}
            >
              <Brain className="w-5 h-5" />
              Start Practice
            </button>
            <button
              onClick={() => navigate('/battle/lobby')}
              className="flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-sm"
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
                "group p-6 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left",
                s.border
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm", s.color)}>
                {s.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{s.name}</h3>
              <p className="text-slate-500 text-sm mt-1">JEE/NEET level</p>
              <div className={cn("flex items-center gap-1 mt-4 text-sm font-medium text-slate-500 transition-colors", `group-hover:${T.text}`)}>
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
            className={cn("p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1")}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", T.iconBg)}>
              {f.icon}
            </div>
            <h3 className="font-semibold mb-2 text-slate-900">{f.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Banner */}
      <section className="py-10 px-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/60 to-emerald-50/60 pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Questions Generated', value: '∞', sub: 'AI-powered' },
            { label: 'Subjects', value: '4', sub: 'Math, Physics, Chem, Bio' },
            { label: 'Battle Players', value: '4', sub: 'Max per room' },
            { label: 'Time Limit', value: '60s', sub: 'Per question' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className={cn("text-3xl font-bold", T.text)}>{stat.value}</div>
              <div className="text-sm font-semibold mt-1 text-slate-900">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-200/70">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-slate-600 text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          Crafted with precision by Nayanxyz
        </div>
      </footer>
    </div>
  )
}