/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Clash Display"', 'sans-serif'],
        body: ['"Satoshi"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#F3F0FF',
          100: '#E9E3FF',
          200: '#D1C6FF',
          300: '#B39BFF',
          400: '#9A80FF',
          500: '#7C5CFC',
          600: '#6847F5',
          700: '#5A3CE0',
          800: '#4B31B8',
          900: '#3C288E',
        },
        surface: {
          DEFAULT: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        sidebar: '#0f172a',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px -10px rgba(99,102,241,0.18)',
        glow: '0 0 0 3px rgba(99,102,241,0.15)',
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M0 0h32v32H0z' fill='none'/%3E%3Cpath d='M0 0h1v32H0zM31 0h1v32h-1zM0 0h32v1H0zM0 31h32v1H0z' fill='%23e2e8f0' opacity='.6'/%3E%3C/svg%3E")`,
        'hero-mesh': 'radial-gradient(at 40% 20%, hsla(240,80%,92%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(260,80%,95%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,80%,94%,1) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}