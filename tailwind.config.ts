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
          DEFAULT: '#FF6B9D',
          light: '#FF8FAB',
          dark: '#FF4578',
          50: '#FFE5ED',
          100: '#FFB6C1',
        },
        accent: {
          orange: '#FF9966',
          pink: '#FFB6C1',
          coral: '#FFE5ED',
        },
        text: {
          dark: '#2C2C2C',
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
