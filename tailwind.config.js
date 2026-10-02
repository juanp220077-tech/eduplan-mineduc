/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        institutional: {
          navy: '#0F172A',
          dark: '#1E293B',
          cobalt: '#2563EB',
        },
        erca: {
          exp: { bg: '#FEF3C7', text: '#92400E' },
          ref: { bg: '#EEF2FF', text: '#3730A3' },
          con: { bg: '#E0F2FE', text: '#0369A1' },
          apl: { bg: '#D1FAE5', text: '#065F46' },
        },
        dua: {
          implication: '#D1FAE5',
          representation: '#EDE9FE',
          action: '#E0F2FE',
        }
      }
    },
  },
  plugins: [],
}