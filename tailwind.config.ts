/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/index.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        // 🌿 Season animations
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'float-slower': 'float-soft 9s ease-in-out infinite',
        'drift': 'drift 16s ease-in-out infinite',
        'drift-slow': 'drift 24s ease-in-out infinite',
        // 🍃 Particle falls
        'fall-slow': 'fall 12s linear infinite',
        'fall-med': 'fall 8s linear infinite',
        'fall-fast': 'fall 5s linear infinite',
        'tumble': 'tumble 4s linear infinite',
        // 💨 Wind
        'wind': 'wind 6s linear infinite',
        'wind-slow': 'wind 10s linear infinite',
        'wind-fast': 'wind 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '0.9', transform: 'scale(1.25)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(4deg)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(48px)' },
        },
        'fall': {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(120px) rotate(360deg)', opacity: '0' },
        },
        'tumble': {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(240px) rotate(720deg)', opacity: '0' },
        },
        'wind': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateX(100vw)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}