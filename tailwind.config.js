/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core theme: deep green, cream, white, with a small gold accent
        // for highlights (countdown ribbons, active states).
        forest: {
          950: '#0F2318',
          900: '#16321F',
          800: '#1F3D2B', // primary brand green (navbar, headings)
          700: '#28502F',
          600: '#336639',
          500: '#3F7A45', // primary buttons / links
          400: '#5C9962',
        },
        sage: {
          100: '#E7EEE4',
          200: '#D2E0CC',
          300: '#B7CFAF', // soft badges / hover states
        },
        cream: {
          DEFAULT: '#FAF6EC',
          100: '#FFFEFB',
          200: '#F5EFDE', // page background
          300: '#ECE3CA', // card borders / dividers
        },
        gold: {
          DEFAULT: '#C9A227', // sparing accent: countdown ribbon, active tab
          light: '#E4C766',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 61, 43, 0.06), 0 4px 16px rgba(31, 61, 43, 0.08)',
      },
    },
  },
  plugins: [],
}
