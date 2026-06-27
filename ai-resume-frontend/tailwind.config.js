/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Layered backgrounds
        base:     '#050505',   // deepest — page bg
        surface:  '#0A0A0A',   // cards, sidebar
        elevated: '#111111',   // modals, dropdowns
        muted:    '#1A1A1A',   // inputs, inactive
        glass:    'rgba(255, 255, 255, 0.03)',
        'glass-hover': 'rgba(255, 255, 255, 0.06)',

        // Brand
        accent: {
          violet: '#7C6FF7',
          'violet-dim': '#5B54C4',
          'violet-glow': 'rgba(124,111,247,0.15)',
          teal:   '#2ECBAD',
          'teal-dim': '#1E9E89',
          'teal-glow': 'rgba(46,203,173,0.15)',
        },

        // Semantic
        success: '#10B981', // Emerald 500
        warning: '#F59E0B', // Amber 500
        danger:  '#F43F5E', // Rose 500
        info:    '#3B82F6', // Blue 500

        // Text hierarchy
        primary:   '#FAFAFA', // Zinc 50
        secondary: '#A1A1AA', // Zinc 400
        tertiary:  '#71717A', // Zinc 500
        disabled:  '#3F3F46', // Zinc 700
      },

      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        // Tighter, more precise scale
        'xs':   ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        'sm':   ['13px', { lineHeight: '20px' }],
        'base': ['14px', { lineHeight: '22px' }],
        'md':   ['15px', { lineHeight: '24px' }],
        'lg':   ['17px', { lineHeight: '26px' }],
        'xl':   ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '2xl':  ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '3xl':  ['30px', { lineHeight: '38px', letterSpacing: '-0.025em' }],
        '4xl':  ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],
      },

      borderRadius: {
        'xs':  '4px',
        'sm':  '6px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '24px',
        '3xl': '32px',
        'pill': '9999px',
        'circle': '50%',
      },

      boxShadow: {
        // Layered shadow system
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-violet': '0 0 20px rgba(124,111,247,0.25), 0 0 40px rgba(124,111,247,0.1)',
        'glow-teal': '0 0 20px rgba(46,203,173,0.25)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.25)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.25)',
        'glow-rose': '0 0 20px rgba(244,63,94,0.25)',
        'btn-primary': '0 1px 0 0 rgba(255,255,255,0.15) inset, 0 -1px 0 0 rgba(0,0,0,0.3) inset, 0 4px 12px rgba(124,111,247,0.3)',
        'btn-hover': '0 1px 0 0 rgba(255,255,255,0.2) inset, 0 -1px 0 0 rgba(0,0,0,0.3) inset, 0 8px 20px rgba(124,111,247,0.4)',
      },

      keyframes: {
        // Shimmer for skeleton loaders
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(6px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'ring-fill': {
          '0%':   { strokeDashoffset: '339' },
          '100%': { strokeDashoffset: 'var(--dash-offset)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '1', transform: 'scale(1.2)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },

      animation: {
        'shimmer':        'shimmer 2s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'float-reverse':  'float-reverse 6s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 4s ease-in-out infinite',
        'ring-fill':      'ring-fill 1.5s ease-out forwards',
        'fade-up':        'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'blink':          'blink 1s step-end infinite',
        'dot-pulse':      'dot-pulse 1.5s ease-in-out infinite',
        'marquee':        'marquee 40s linear infinite',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}