import { useMemo } from 'react'
import { Leaf, Cloud } from 'lucide-react'

// Deterministic pseudo-random so sparkles stay in place between re-renders
function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function NatureBackdrop() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: seeded(i + 1) * 100,
        top: seeded(i + 101) * 65,
        size: 3 + seeded(i + 201) * 4,
        delay: seeded(i + 301) * 4,
        duration: 2.5 + seeded(i + 401) * 3,
      })),
    []
  )

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-sky-meadow">
      {/* ☀️ Warm sun glow */}
      <div className="absolute -top-28 right-[8%] w-80 h-80 rounded-full bg-amber-200/70 blur-3xl" />
      <div className="absolute top-10 right-[14%] w-24 h-24 rounded-full bg-amber-300/80 blur-xl" />

      {/* ✨ Twinkling sun-pollen / fireflies (nature version of Ref 1's stars) */}
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-amber-400/70 animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* ☁️ Flat drifting clouds (Ref 2's illustration style) */}
      <div className="absolute top-[12%] left-[6%] animate-drift">
        <Cloud className="w-44 h-44 text-white/80 fill-white/80" strokeWidth={0} />
      </div>
      <div className="absolute top-[26%] right-[10%] animate-drift-slow">
        <Cloud className="w-32 h-32 text-white/60 fill-white/60" strokeWidth={0} />
      </div>
      <div className="absolute top-[48%] left-[16%] animate-drift-slow">
        <Cloud className="w-24 h-24 text-white/50 fill-white/50" strokeWidth={0} />
      </div>

      {/* 🍃 Floating leaves */}
      <div className="absolute top-[18%] right-[28%] animate-float-soft">
        <Leaf className="w-8 h-8 text-emerald-400/70 rotate-45" />
      </div>
      <div className="absolute top-[55%] left-[8%] animate-float-slower">
        <Leaf className="w-6 h-6 text-teal-400/60 -rotate-12" />
      </div>
      <div className="absolute top-[35%] right-[6%] animate-float-slower">
        <Leaf className="w-7 h-7 text-lime-400/60 rotate-12" />
      </div>

      {/* ⛰️ Rolling meadow hills — flat vector illustration, layered for depth */}
      <svg
        className="absolute bottom-0 left-0 w-full h-40 md:h-56"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#bbf7d0"
          fillOpacity="0.9"
          d="M0,192L80,197.3C160,203,320,213,480,208C640,203,800,181,960,181.3C1120,181,1280,203,1360,213.3L1440,224L1440,320L0,320Z"
        />
        <path
          fill="#86efac"
          fillOpacity="0.8"
          d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,261.3C1120,267,1280,245,1360,234.7L1440,224L1440,320L0,320Z"
        />
        <path
          fill="#4ade80"
          fillOpacity="0.7"
          d="M0,288L80,282.7C160,277,320,267,480,272C640,277,800,299,960,304C1120,309,1280,299,1360,293.3L1440,288L1440,320L0,320Z"
        />
      </svg>
    </div>
  )
}