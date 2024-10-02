/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container:{
      center:true,
      padding:{
        default:"20px",
        md:"40px",
        '2xl': '60px',
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}