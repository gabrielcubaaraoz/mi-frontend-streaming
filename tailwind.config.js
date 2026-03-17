/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './services/**/*.{js,jsx}',
    './utils/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        carbon: {
          950: '#08090b',
          900: '#0d1117',
          800: '#151b23',
          700: '#1c2433',
          600: '#243040',
          500: '#2e3d50',
          400: '#3d5168',
          300: '#5a7085',
          200: '#8099b0',
          100: '#b0c4d8',
          50:  '#d8e8f5',
        },
        accent: {
          600: '#00cc6a',
          500: '#00ff88',
          400: '#33ffaa',
          300: '#66ffc0',
        },
        brand: {
          600: '#6d28d9',
          500: '#7c3aed',
          400: '#8b5cf6',
        },
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40V0h.5v40zM40 0v40h-.5V0zM0 .5h40M0 40h40' stroke='%23ffffff06' stroke-width='.5'/%3E%3C/svg%3E\")",
        'glow-accent': 'radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)',
        'glow-brand':  'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'sidebar-gradient': 'linear-gradient(180deg, #0d1117 0%, #0a0e15 100%)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(0,255,136,0.25)',
        'glow-sm':     '0 0 10px rgba(0,255,136,0.15)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.5)',
        'modal':       '0 24px 64px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up':   'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 0.25s ease forwards',
        'slide-in':  'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':   'shimmer 1.8s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'scale-in':  'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity:0, transform:'translateY(16px)' }, '100%': { opacity:1, transform:'translateY(0)' }},
        fadeIn:  { '0%': { opacity:0 }, '100%': { opacity:1 }},
        slideIn: { '0%': { opacity:0, transform:'translateX(-16px)' }, '100%': { opacity:1, transform:'translateX(0)' }},
        scaleIn: { '0%': { opacity:0, transform:'scale(0.92)' }, '100%': { opacity:1, transform:'scale(1)' }},
        bounceIn:{ '0%': { opacity:0, transform:'scale(0.8)' }, '60%': { transform:'scale(1.05)' }, '100%': { opacity:1, transform:'scale(1)' }},
        pulseDot:{ '0%,100%': { opacity:1 }, '50%': { opacity:0.4 }},
        shimmer: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' }},
      },
    },
  },
  plugins: [],
}
