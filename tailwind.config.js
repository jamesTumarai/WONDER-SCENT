/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        prompt: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sarabun: ['Sarabun', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        leaf: {
          50: '#F4F5F0',
          100: '#E5E8DF',
          400: '#8F9776',
          500: '#7C8363',
          600: '#6A7054',
          700: '#555A43',
        },
        clay: {
          50: '#F8F3F0',
          100: '#EBDAD1',
          400: '#D09476',
          500: '#BA7E60',
          600: '#A06B50',
        },
        sand: {
          50: '#FCFAF8',
          100: '#F5F2EB',
          200: '#EAE6DF',
        }
      }
    },
  },
  plugins: [],
}
