import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        floria: {
          deep: '#0a1f0d',
          green: '#1a3d1f',
          leaf: '#2d6a4f',
          // gold: '#c9a84c',
          gold:"#F0E53C",
          saffron: '#c9a84c',
          amber: '#e8b84b',
          cream: '#f5f0e8',
          ivory: '#faf6ee',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.9s ease both',
        'fade-in': 'fadeIn 1.1s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
