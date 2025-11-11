import type { Config } from 'tailwindcss'

const config: Config = {
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
          light: '#F5F5F5',
          white: '#FFFFFF',
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
    },
  },
  plugins: [],
}
export default config

module.exports = {
  theme: {
    extend: {
      colors: {
        'accent-red': '#FF4458',
        'primary': '#FF69B4',
        'primary-dark': '#FF1493',
        'primary-50': '#FFF0F5',
      },
    },
  },
}