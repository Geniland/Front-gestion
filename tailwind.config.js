/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mairie-blue': '#0056b3',
        'mairie-green': '#28a745',
        'mairie-light': '#f8f9fa',
      }
    },
  },
  plugins: [],
}
