/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#e9f6f4',
        'background': '#081916',
        'primary': '#88e6d7',
        'secondary': '#12927d',
        'accent': '#24f5d3',
      },
    },
  },
  plugins: [],
}

