import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(0 0% 100%)',
          dark: 'hsl(222 47% 7%)'
        },
        foreground: {
          DEFAULT: 'hsl(222 47% 11%)',
          dark: 'hsl(210 40% 98%)'
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.15)'
      },
    },
  },
  plugins: [],
}
export default config
