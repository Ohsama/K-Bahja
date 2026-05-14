/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e879f9', // fuchsia-400
          DEFAULT: '#a21caf', // fuchsia-700 (matching the AuthScreen logo text)
          dark: '#701a75', // fuchsia-900
        },
        success: '#10b981', // emerald
        warning: '#eab308', // yellow
        danger: '#ef4444', // red
        neutral: '#78716c', // stone/brown
        surface: '#fdf2f8', // pink-50 (matching the new background)
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
      }
    },
  },
  plugins: [],
}
