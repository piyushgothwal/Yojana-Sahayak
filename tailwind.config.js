/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF1F7',
          100: '#D4DBE7',
          200: '#A8B5CF',
          300: '#7D8FB6',
          400: '#566A93',
          500: '#324A78',
          600: '#1B2A4A',
          700: '#16223D',
          800: '#111A30',
          900: '#0C1322',
        },
        saffron: {
          50: '#FDF1E6',
          100: '#FAE0C9',
          200: '#F4C08D',
          300: '#EFA255',
          400: '#E8792B',
          500: '#D2691E',
          600: '#B05717',
          700: '#8E4611',
          800: '#6C3410',
          900: '#4D240A',
        },
        teal: {
          50: '#E7F3F0',
          100: '#C7E6DF',
          200: '#8FCFC1',
          300: '#5BB4A2',
          400: '#2F7D6B',
          500: '#256A5A',
          600: '#1D5649',
          700: '#154235',
          800: '#0E2E24',
          900: '#081C15',
        },
        paper: '#F7F7F5',
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(27, 42, 74, 0.08), 0 4px 16px -4px rgba(27, 42, 74, 0.06)',
        card: '0 1px 3px rgba(27, 42, 74, 0.08), 0 6px 24px -8px rgba(27, 42, 74, 0.12)',
      },
    },
  },
  plugins: [],
};
