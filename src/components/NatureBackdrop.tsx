import { useMemo } from 'react'
import { useThemeStore, type Season } from '../store/themeStore'

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

type TreeKind = 'blossom' | 'full' | 'autumn' | 'bare'

interface Palette {
  sky: string
  hills: { fill: string; opacity: number }[]
  trunk: string
  treeKind: TreeKind
  canopy: { base: string; shade: string; light: string }
  blossom?: string
  groundDecor?: { color: string; type: 'leaf' | 'snow' }[]
  sunColor: string
  sunGlow: string
  particleColor: string
  particleType: 'petal' | 'leaf' | 'snow' | 'sparkle'
  fallClass: string
  windClass: string
  windOpacity: number
}

const palettes: Record<Season, Palette> = {
  spring: {
    sky: 'bg-sky-spring',
    hills: [
      { fill: '#e4d5b7', opacity: 0.9 },
      { fill: '#d4be8e', opacity: 0.9 },
      { fill: '#b89b6a', opacity: 0.9 },
    ],
    trunk: '#8b5a3c',
    treeKind: 'blossom',
    canopy: { base: '#86efac', shade: '#6ee7b7', light: '#bbf7d0' },
    blossom: '#f9a8d4',
    sunColor: 'bg-rose-200/70',
    sunGlow: 'bg-rose-100/80',
    particleColor: '#fbcfe8',
    particleType: 'petal',
    fallClass: 'animate-fall-slow',
    windClass: 'animate-wind-slow',
    windOpacity: 0.15,
  },
  summer: {
    sky: 'bg-sky-summer',
    hills: [
      { fill: '#c4a97d', opacity: 0.9 },
      { fill: '#a88968', opacity: 0.9 },
      { fill: '#8b6f47', opacity: 0.9 },
    ],
    trunk: '#7c4a2d',
    treeKind: 'full',
    canopy: { base: '#4ade80', shade: '#22c55e', light: '#86efac' },
    sunColor: 'bg-amber-300/80',
    sunGlow: 'bg-amber-200/70',
    particleColor: '#fcd34d',
    particleType: 'sparkle',
    fallClass: 'animate-fall-slow',
    windClass: 'animate-wind-slow',
    windOpacity: 0.1,
  },
  autumn: {
    sky: 'bg-sky-autumn',
    hills: [
      { fill: '#94856d', opacity: 0.9 },
      { fill: '#78716c', opacity: 0.9 },
      { fill: '#57534e', opacity: 0.9 },
    ],
    trunk: '#7c4a2d',
    treeKind: 'autumn',
    canopy: { base: '#fb923c', shade: '#ea580c', light: '#fbbf24' },
    groundDecor: [
      { color: '#ea580c', type: 'leaf' },
      { color: '#dc2626', type: 'leaf' },
      { color: '#ca8a04', type: 'leaf' },
    ],
    sunColor: 'bg-orange-300/70',
    sunGlow: 'bg-orange-200/60',
    particleColor: '#fb923c',
    particleType: 'leaf',
    fallClass: 'animate-tumble',
    windClass: 'animate-wind',
    windOpacity: 0.2,
  },
  winter: {
    sky: 'bg-sky-winter',
    hills: [
      { fill: '#94a3b8', opacity: 0.9 },
      { fill: '#64748b', opacity: 0.9 },
      { fill: '#475569', opacity: 0.9 },
    ],
    trunk: '#7d5a4a',
    treeKind: 'bare',
    canopy: { base: '#57534e', shade: '#44403c', light: '#78716c' },
    groundDecor: [{ color: '#f8fafc', type: 'snow' }],
    sunColor: 'bg-sky-200/80',
    sunGlow: 'bg-sky-100/70',
    particleColor: '#f8fafc',
    particleType: 'snow',
    fallClass: 'animate-fall-med',
    windClass: 'animate-wind-fast',
    windOpacity: 0.25,
  },
}

/* Branch-tip coordinates — foliage clusters sit on these (Image 1 style) */
const TIPS: [number, number][] = [
  [40, 96], [54, 84], [66, 64], [86, 46], [100, 36],
  [114, 46], [134, 64], [146, 84], [160, 96],
]

/* 🌳 Ground mound: grass (spring/summer), leaf litter (autumn), snow (winter) */
function Mound({ kind }: { kind: TreeKind }) {
  if (kind === 'bare') {
    return (
      <g>
        <ellipse cx="100" cy="222" rx="50" ry="11" fill="#f1f5f9" />
        <ellipse cx="100" cy="225" rx="48" ry="8" fill="#e2e8f0" opacity="0.8" />
      </g>
    )
  }
  if (kind === 'autumn') {
    return (
      <g>
        <ellipse cx="100" cy="222" rx="50" ry="11" fill="#d9c08f" />
        <ellipse cx="100" cy="224" rx="48" ry="8" fill="#c4a97d" opacity="0.7" />
        <ellipse cx="100" cy="219" rx="20" ry="6" fill="#ea580c" opacity="0.7" />
        <ellipse cx="82" cy="221" rx="3.5" ry="1.8" fill="#dc2626" />
        <ellipse cx="118" cy="222" rx="3.5" ry="1.8" fill="#ca8a04" />
        <ellipse cx="66" cy="223" rx="3" ry="1.5" fill="#ea580c" />
        <ellipse cx="134" cy="223" rx="3" ry="1.5" fill="#dc2626" />
      </g>
    )
  }
  const green = kind === 'blossom' ? '#86efac' : '#4ade80'
  const greenDark = kind === 'blossom' ? '#4ade80' : '#22c55e'
  return (
    <g>
      <ellipse cx="100" cy="222" rx="50" ry="11" fill={green} />
      <ellipse cx="100" cy="225" rx="48" ry="8" fill={greenDark} opacity="0.5" />
      <g stroke={greenDark} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M 60 216 q 1 -7 3 -1 q 1 -8 3 -1 q 1 -6 3 0" />
        <path d="M 131 216 q 1 -7 3 -1 q 1 -8 3 -1 q 1 -6 3 0" />
      </g>
      {kind === 'blossom' && (
        <g fill="#f9a8d4">
          <circle cx="76" cy="220" r="2" />
          <circle cx="122" cy="221" r="2" />
          <circle cx="100" cy="225" r="2" />
        </g>
      )}
    </g>
  )
}

/* 🌳 Flat-vector tree: branch skeleton + clustered foliage + ground mound */
function Tree({ palette, scale = 1, flip = false }: { palette: Palette; scale?: number; flip?: boolean }) {
  const kind = palette.treeKind
  const trunk = palette.trunk
  const c = palette.canopy

  return (
    <svg
      width={200 * scale}
      height={240 * scale}
      viewBox="0 0 200 240"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
    >
      {/* soft contact shadow */}
      <ellipse cx="100" cy="229" rx="44" ry="6" fill="#000" opacity="0.07" />

      {/* ground mound (tree is PLANTED in it) */}
      <Mound kind={kind} />

      {/* trunk with root flare */}
      <path d="M 92 224 C 94 196 95 172 96 150 L 104 150 C 105 172 106 196 108 224 C 104 221 96 221 92 224 Z" fill={trunk} />
      <path d="M 101 224 C 102 196 103 172 103 150 L 104 150 C 105 172 106 196 108 224 C 106 222 103 222 101 224 Z" fill="#000" opacity="0.15" />

      {/* branch skeleton — always visible (Image 1 style) */}
      <g stroke={trunk} fill="none" strokeLinecap="round">
        <path d="M 100 152 C 92 132 78 118 62 108" strokeWidth="7" />
        <path d="M 100 152 C 108 132 122 118 138 108" strokeWidth="7" />
        <path d="M 100 150 C 96 124 90 104 82 84" strokeWidth="6" />
        <path d="M 100 150 C 104 124 110 104 118 84" strokeWidth="6" />
        <path d="M 100 148 C 100 120 100 96 100 70" strokeWidth="5" />
        <path d="M 62 108 C 54 102 48 98 40 96" strokeWidth="3.5" />
        <path d="M 62 108 C 58 98 56 92 54 84" strokeWidth="3.5" />
        <path d="M 138 108 C 146 102 152 98 160 96" strokeWidth="3.5" />
        <path d="M 138 108 C 142 98 144 92 146 84" strokeWidth="3.5" />
        <path d="M 82 84 C 76 76 72 70 66 64" strokeWidth="3" />
        <path d="M 118 84 C 124 76 128 70 134 64" strokeWidth="3" />
        <path d="M 100 70 C 94 60 90 54 86 46" strokeWidth="3" />
        <path d="M 100 70 C 106 60 110 54 114 46" strokeWidth="3" />
      </g>

      {/* 🌸 SPRING: sparse young leaf-clusters at branch tips + blossoms */}
      {kind === 'blossom' && (
        <g>
          {TIPS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={c.light} />
              <circle cx={x - 6} cy={y + 4} r="5.5" fill={c.base} />
              <circle cx={x + 6} cy={y + 3} r="5.5" fill={c.base} />
              {i % 2 === 0 && <circle cx={x + 2} cy={y - 5} r="2.5" fill={palette.blossom} />}
              {i % 3 === 0 && <circle cx={x - 4} cy={y - 3} r="2" fill={palette.blossom} />}
            </g>
          ))}
        </g>
      )}

      {/* ☀️ SUMMER / 🍂 AUTUMN: full clustered canopy (3-tone, Image 1/4 style) */}
      {(kind === 'full' || kind === 'autumn') && (
        <g>
          <ellipse cx="62" cy="92" rx="26" ry="21" fill={c.base} transform="rotate(-12 62 92)" />
          <ellipse cx="138" cy="92" rx="26" ry="21" fill={c.base} transform="rotate(12 138 92)" />
          <ellipse cx="80" cy="62" rx="27" ry="23" fill={c.base} transform="rotate(-8 80 62)" />
          <ellipse cx="120" cy="62" rx="27" ry="23" fill={c.base} transform="rotate(8 120 62)" />
          <ellipse cx="100" cy="44" rx="29" ry="23" fill={c.base} />
          <ellipse cx="100" cy="78" rx="34" ry="20" fill={c.base} />
          {/* shade layer (bottom) */}
          <ellipse cx="76" cy="88" rx="18" ry="13" fill={c.shade} opacity="0.5" />
          <ellipse cx="124" cy="88" rx="18" ry="13" fill={c.shade} opacity="0.5" />
          <ellipse cx="100" cy="90" rx="22" ry="12" fill={c.shade} opacity="0.35" />
          {/* light layer (top-left, sun side) */}
          <ellipse cx="88" cy="40" rx="15" ry="11" fill={c.light} opacity="0.9" />
          <ellipse cx="110" cy="32" rx="11" ry="8" fill={c.light} opacity="0.8" />
          <ellipse cx="64" cy="72" rx="10" ry="8" fill={c.light} opacity="0.6" />
          {/* branch tips peeking through (Image 3 trick) */}
          <circle cx="40" cy="96" r="6" fill={c.shade} opacity="0.9" />
          <circle cx="160" cy="96" r="6" fill={c.shade} opacity="0.9" />
        </g>
      )}

      {/* 🍂 autumn: a few leaves detaching near the canopy */}
      {kind === 'autumn' && (
        <g>
          <ellipse cx="70" cy="128" rx="5" ry="3" fill={c.shade} transform="rotate(30 70 128)" />
          <ellipse cx="134" cy="140" rx="5" ry="3" fill={c.light} transform="rotate(-25 134 140)" />
          <ellipse cx="98" cy="158" rx="5" ry="3" fill={c.shade} transform="rotate(60 98 158)" />
          <ellipse cx="118" cy="120" rx="4" ry="2.5" fill={c.light} transform="rotate(-40 118 120)" />
        </g>
      )}

      {/* ❄️ WINTER: bare skeleton + snow resting on branch unions */}
      {kind === 'bare' && (
        <g fill="#f8fafc">
          <ellipse cx="100" cy="149" rx="9" ry="3" />
          <ellipse cx="62" cy="107" rx="7" ry="2.5" />
          <ellipse cx="138" cy="107" rx="7" ry="2.5" />
          <ellipse cx="82" cy="83" rx="6" ry="2" />
          <ellipse cx="118" cy="83" rx="6" ry="2" />
          <ellipse cx="100" cy="69" rx="6" ry="2" />
          <ellipse cx="40" cy="95" rx="4" ry="1.5" />
          <ellipse cx="160" cy="95" rx="4" ry="1.5" />
          <ellipse cx="54" cy="83" rx="4" ry="1.5" />
          <ellipse cx="146" cy="83" rx="4" ry="1.5" />
        </g>
      )}
    </svg>
  )
}

export default function NatureBackdrop() {
  const season = useThemeStore((s) => s.season)
  const palette = palettes[season]

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: seeded(i + 1) * 100,
        size: 6 + seeded(i + 101) * 8,
        delay: seeded(i + 201) * 10,
        duration: 8 + seeded(i + 301) * 8,
      })),
    []
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: seeded(i + 501) * 100,
        top: seeded(i + 601) * 70,
        size: 2 + seeded(i + 701) * 3,
        delay: seeded(i + 801) * 4,
        duration: 2.5 + seeded(i + 901) * 3,
      })),
    []
  )

  const windLines = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        top: 10 + seeded(i + 1001) * 60,
        width: 60 + seeded(i + 1101) * 120,
        delay: seeded(i + 1201) * 6,
        duration: 4 + seeded(i + 1301) * 4,
      })),
    []
  )

  const decorType = palette.groundDecor?.[0]?.type

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${palette.sky}`} />

      <div className={`absolute -top-28 right-[8%] w-80 h-80 rounded-full blur-3xl ${palette.sunGlow}`} />
      <div className={`absolute top-10 right-[14%] w-24 h-24 rounded-full blur-xl ${palette.sunColor}`} />

      {palette.particleType === 'sparkle' &&
        sparkles.map((s, i) => (
          <span
            key={`sp-${i}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: palette.particleColor,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

      {/* 💨 Wind moves ONLY particles/streaks — trees stay planted */}
      {windLines.map((w, i) => (
        <div
          key={`w-${i}`}
          className={`absolute h-px ${palette.windClass}`}
          style={{
            top: `${w.top}%`,
            width: `${w.width}px`,
            background: `linear-gradient(90deg, transparent, ${palette.particleColor}, transparent)`,
            opacity: palette.windOpacity,
            animationDelay: `${w.delay}s`,
            animationDuration: `${w.duration}s`,
          }}
        />
      ))}

      {palette.particleType !== 'sparkle' &&
        particles.map((p, i) => (
          <div
            key={`p-${i}`}
            className={`absolute ${palette.fallClass}`}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {palette.particleType === 'snow' ? (
              <div
                className="rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: palette.particleColor,
                  boxShadow: `0 0 ${p.size}px rgba(255,255,255,0.6)`,
                }}
              />
            ) : palette.particleType === 'petal' ? (
              <svg width={p.size} height={p.size} viewBox="0 0 20 20">
                <ellipse cx="10" cy="10" rx="8" ry="4" fill={palette.particleColor} />
              </svg>
            ) : (
              <svg width={p.size * 1.3} height={p.size} viewBox="0 0 26 20">
                <path
                  d="M 2 10 Q 13 2 24 10 Q 13 18 2 10 Z"
                  fill={i % 3 === 0 ? '#ea580c' : i % 3 === 1 ? '#dc2626' : '#ca8a04'}
                />
              </svg>
            )}
          </div>
        ))}

      {/* 🌳 PLANTED trees — layered depths, no floating */}
      <div className="absolute bottom-24 md:bottom-32 left-[12%] opacity-80">
        <Tree palette={palette} scale={0.55} />
      </div>
      <div className="absolute bottom-16 md:bottom-24 left-[3%]">
        <Tree palette={palette} scale={0.85} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 left-[24%]">
        <Tree palette={palette} scale={1.05} flip />
      </div>
      <div className="absolute bottom-24 md:bottom-32 right-[14%] opacity-80">
        <Tree palette={palette} scale={0.6} flip />
      </div>
      <div className="absolute bottom-16 md:bottom-24 right-[22%]">
        <Tree palette={palette} scale={1} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 right-[3%]">
        <Tree palette={palette} scale={0.9} flip />
      </div>

      {decorType === 'leaf' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-around px-8">
          {palette.groundDecor!.map((d, i) => (
            <svg key={i} width="18" height="14" viewBox="0 0 26 20" className="rotate-90">
              <path d="M 2 10 Q 13 2 24 10 Q 13 18 2 10 Z" fill={d.color} />
            </svg>
          ))}
        </div>
      )}
      {decorType === 'snow' && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white/60 blur-sm" />
          <div className="absolute bottom-14 left-[10%] w-32 h-3 bg-white/70 rounded-full blur-sm" />
          <div className="absolute bottom-16 right-[15%] w-40 h-3 bg-white/70 rounded-full blur-sm" />
        </>
      )}

      <svg
        className="absolute bottom-0 left-0 w-full h-40 md:h-56"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={palette.hills[0].fill}
          fillOpacity={palette.hills[0].opacity}
          d="M0,192L80,197.3C160,203,320,213,480,208C640,203,800,181,960,181.3C1120,181,1280,203,1360,213.3L1440,224L1440,320L0,320Z"
        />
        <path
          fill={palette.hills[1].fill}
          fillOpacity={palette.hills[1].opacity}
          d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,261.3C1120,267,1280,245,1360,234.7L1440,224L1440,320L0,320Z"
        />
        <path
          fill={palette.hills[2].fill}
          fillOpacity={palette.hills[2].opacity}
          d="M0,288L80,282.7C160,277,320,267,480,272C640,277,800,299,960,304C1120,309,1280,299,1360,293.3L1440,288L1440,320L0,320Z"
        />
      </svg>
    </div>
  )
}