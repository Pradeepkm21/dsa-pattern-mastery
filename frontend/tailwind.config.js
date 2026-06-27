/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#151D30',
          700: '#1F293D',
          600: '#2A374E',
        },
        brand: {
          500: '#6366F1', // indigo-500
          600: '#4F46E5', // indigo-600
          700: '#4338CA', // indigo-700
        },
      },
    },
  },
  plugins: [],
}
