/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(230 20% 12%)',
        accent: 'hsl(130 70% 55%)',
        primary: 'hsl(230 70% 55%)',
        surface: 'hsl(230 20% 16%)',
        'text-primary': 'hsl(230 10% 95%)',
        'text-secondary': 'hsl(230 10% 70%)',
        purple: {
          500: 'hsl(260 70% 60%)',
          600: 'hsl(260 70% 50%)',
          700: 'hsl(260 70% 40%)',
        },
        blue: {
          400: 'hsl(210 70% 60%)',
          500: 'hsl(210 70% 50%)',
          600: 'hsl(210 70% 40%)',
        }
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.1)',
        'focus-ring': '0 0 0 3px hsla(130, 70%, 55%, 0.5)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}