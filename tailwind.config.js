/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hind Siliguri"','"Noto Sans Bengali"','system-ui','sans-serif'],
        bangla: ['"Hind Siliguri"','"Noto Sans Bengali"','sans-serif'],
      },
      colors: {
        primary: { DEFAULT:'#0f766e', 50:'#f0fdfa',100:'#ccfbf1',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a' },
        accent: '#f59e0b',
      }
    },
  },
  plugins: [],
}

