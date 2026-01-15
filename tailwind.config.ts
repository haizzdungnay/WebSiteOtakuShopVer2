import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB6C1',
          light: '#FFC0CB',
          dark: '#FF8FAB',
          50: '#FFE5ED',
          100: '#FFD5DC',
        },
        'accent-red': '#FF4458',
        accent: {
          red: '#FF4444',
          orange: '#FF9966',
          pink: '#FFB6C1',
          coral: '#FFE5ED',
        },
        text: {
          dark: '#333333',
          gray: '#666666',
        },
        background: {
          light: '#FFF5F7',     // Light pastel pink for light mode
          white: '#FFFFFF',
          pink: '#FFF0F3',      // Slightly lighter pink
        },
        // Dark mode specific colors
        dark: {
          bg: '#0f172a',        // slate-900
          card: '#1e293b',      // slate-800
          border: '#334155',    // slate-700
          text: '#f1f5f9',      // slate-100
          muted: '#94a3b8',     // slate-400
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
      },
      // Animation for dark mode transition
      transitionProperty: {
        'colors-shadow': 'color, background-color, border-color, box-shadow',
      },
    },
  },
  plugins: [],
}
export default config
