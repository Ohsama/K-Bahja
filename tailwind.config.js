/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a855f7', // purple-500
          DEFAULT: '#7e22ce', // purple-700
          dark: '#581c87', // purple-900
        },
        surface: '#f8fafc', // slate-50
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
      }
    },
  },
  plugins: [],
}
