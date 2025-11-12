/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'cvac-blue': '#2B5A87',
        'cvac-gold': '#D4AF37',
        'cvac-light-blue': '#4A7BA7',
        'cvac-cream': '#F8F6F0',
      }
    },
  },
  plugins: [],
}

