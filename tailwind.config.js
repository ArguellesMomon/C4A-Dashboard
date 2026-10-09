/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core theme: deep green, cream, white, with a small gold accent
        // for highlights (countdown ribbons, active states).
        forest: {
          950: 'rgb(var(--forest-950) / <alpha-value>)',
          900: 'rgb(var(--forest-900) / <alpha-value>)',
          800: 'rgb(var(--forest-800) / <alpha-value>)', // primary brand green (navbar, headings)
          700: 'rgb(var(--forest-700) / <alpha-value>)',
          600: 'rgb(var(--forest-600) / <alpha-value>)',
          500: 'rgb(var(--forest-500) / <alpha-value>)', // primary buttons / links
          400: 'rgb(var(--forest-400) / <alpha-value>)',
        },
        sage: {
          100: 'rgb(var(--sage-100) / <alpha-value>)',
          200: 'rgb(var(--sage-200) / <alpha-value>)',
          300: 'rgb(var(--sage-300) / <alpha-value>)', // soft badges / hover states
        },
        cream: {
          DEFAULT: 'rgb(var(--cream-100) / <alpha-value>)',
          100: 'rgb(var(--cream-100) / <alpha-value>)',
          200: 'rgb(var(--cream-200) / <alpha-value>)', // page background
          300: 'rgb(var(--cream-300) / <alpha-value>)', // card borders / dividers
        },
        gold: {
          DEFAULT: 'rgb(var(--gold) / <alpha-value>)', // sparing accent: countdown ribbon, active tab
          light: 'rgb(var(--gold-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 61, 43, 0.06), 0 4px 16px rgba(31, 61, 43, 0.08)',
      },
    },
  },
  plugins: [],
}
