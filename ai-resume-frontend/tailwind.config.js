/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Layered backgrounds — never use flat black
        base:     '#0A0B0F',   // deepest — page bg
        surface:  '#111318',   // cards, sidebar
        elevated: '#181C24',   // modals, dropdowns
        muted:    '#1E2330',   // inputs, inactive

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
        success: '#2ECBAD',
        warning: '#FBBF24',
        danger:  '#F87171',
        info:    '#60A5FA',

        // Text hierarchy
        primary:   '#F8FAFC',
        secondary: '#94A3B8',
        tertiary:  '#475569',
        disabled:  '#334155',
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
        'sm':  '6px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      boxShadow: {
        // Layered shadow system — never use single shadows
        'card': `
          0 1px 0 0 rgba(255,255,255,0.04) inset,
          0 1px 2px 0 rgba(0,0,0,0.3),
          0 4px 8px 0 rgba(0,0,0,0.2)
        `,
        'card-hover': `
          0 1px 0 0 rgba(255,255,255,0.06) inset,
          0 2px 4px 0 rgba(0,0,0,0.3),
          0 8px 24px 0 rgba(0,0,0,0.3),
          0 0 0 1px rgba(124,111,247,0.12)
        `,
        'glow-violet': `
          0 0 0 1px rgba(124,111,247,0.3),
          0 0 20px rgba(124,111,247,0.15),
          0 0 40px rgba(124,111,247,0.05)
        `,
        'glow-teal': `
          0 0 0 1px rgba(46,203,173,0.3),
          0 0 20px rgba(46,203,173,0.15)
        `,
        'btn': `
          0 1px 0 0 rgba(255,255,255,0.12) inset,
          0 -1px 0 0 rgba(0,0,0,0.3) inset,
          0 2px 4px rgba(0,0,0,0.3),
          0 0 0 1px rgba(124,111,247,0.5)
        `,
        'input-focus': `
          0 0 0 3px rgba(124,111,247,0.2),
          0 0 0 1px rgba(124,111,247,0.6)
        `,
      },

      keyframes: {
        // Shimmer for skeleton loaders
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        // Subtle float — cards and icons only
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        // Breathing glow — badges and CTAs
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(124,111,247,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(124,111,247,0.6)' },
        },
        // Score ring fill
        'ring-fill': {
          '0%':   { strokeDashoffset: '339' },
          '100%': { strokeDashoffset: 'var(--dash-offset)' },
        },
        // Fade up — used everywhere
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Counter number roll
        'count-up': {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Typing cursor blink
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        // Gradient shift for hero
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        // Streaming dot pulse
        'dot-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '1', transform: 'scale(1.3)' },
        },
      },

      animation: {
        'shimmer':        'shimmer 1.8s linear infinite',
        'float':          'float 4s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
        'ring-fill':      'ring-fill 1.2s ease-out forwards',
        'fade-up':        'fade-up 0.5s ease-out forwards',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'blink':          'blink 1s step-end infinite',
        'dot-pulse':      'dot-pulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}