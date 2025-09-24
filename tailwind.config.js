/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government-grade colors from design guidelines
        success: 'hsl(142, 76%, 36%)',
        warning: 'hsl(25, 95%, 53%)',
        error: 'hsl(0, 84%, 60%)',
        neutral: 'hsl(210, 11%, 71%)',
        'gov-blue': 'hsl(220, 75%, 35%)',
        'gov-blue-light': 'hsl(210, 80%, 50%)',
        // Dark mode colors
        'dark-bg': 'hsl(220, 13%, 9%)',
        'dark-surface': 'hsl(220, 13%, 14%)',
      },
      fontFamily: {
        'noto-sans': ['Noto Sans', 'sans-serif'],
        'noto-mono': ['Noto Sans Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-slide-up': 'fadeSlideUp 0.8s ease-out',
        'fade-slide-up-delay': 'fadeSlideUp 0.8s ease-out 0.2s both',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeSlideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
    },
  },
  plugins: [],
}