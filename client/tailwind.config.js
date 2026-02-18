/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        rift: {
          navy: '#0A0E1A',
          black: '#060810',
          teal: '#00F5D4',
          violet: '#7B2FBE',
          dark: '#131620',
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00F5D4', // Electric Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          500: '#7B2FBE', // Violet
        },
        dark: {
          50: '#1a1d2d',
          100: '#131620',
          200: '#0A0E1A', // Deep Navy
          300: '#060810', // Pure Black
          400: '#52525b',
          500: '#71717a',
        },
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(0, 245, 212, 0.1) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(10, 14, 26, 0.7), rgba(6, 8, 16, 0.5))',
        'glass-teal': 'linear-gradient(135deg, rgba(0, 245, 212, 0.05), rgba(0, 245, 212, 0.01))',
        'glass-violet': 'linear-gradient(135deg, rgba(123, 47, 190, 0.05), rgba(123, 47, 190, 0.01))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slow-spin': 'spin 10s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5), 0 0 10px rgba(14, 165, 233, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(14, 165, 233, 0.8), 0 0 20px rgba(14, 165, 233, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
