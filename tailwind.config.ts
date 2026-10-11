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
        // 🌿 Nature theme animations
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'float-slower': 'float-soft 9s ease-in-out infinite',
        'drift': 'drift 16s ease-in-out infinite',
        'drift-slow': 'drift 24s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}