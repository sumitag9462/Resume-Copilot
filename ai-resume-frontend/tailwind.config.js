/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-base': '#0A0B0F',
        'bg-surface': '#111318',
        'bg-elevated': '#181C24',
        'bg-muted': '#1E2330',
        'border-subtle': 'rgba(255, 255, 255, 0.06)',
        'border-normal': 'rgba(255, 255, 255, 0.10)',
        'border-strong': 'rgba(255, 255, 255, 0.18)',
        'accent-violet': '#7C6FF7',
        'accent-violet-light': '#A89EFF',
        'accent-teal': '#2ECBAD',
        'accent-teal-light': '#5EEBD0',
        'text-primary': '#F0F0F5',
        'text-secondary': '#9B9FAD',
        'text-muted': '#5C6070',
        brand: {
          50:  '#F3F0FF',
          100: '#E9E3FF',
          200: '#D1C6FF',
          300: '#B39BFF',
          400: '#9A80FF',
          500: '#7C6FF7',
          600: '#6847F5',
          700: '#5A3CE0',
          800: '#4B31B8',
          900: '#3C288E',
        },
        surface: {
          DEFAULT: '#111318',
          50: '#0A0B0F',
          100: '#181C24',
          200: '#1E2330',
        },
        sidebar: '#111318',
      },
      transitionDuration: {
        DEFAULT: '200ms',
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