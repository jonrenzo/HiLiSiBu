/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        "poppins-bold": ["Poppins_700Bold"],
        serif: ["Poppins_700SemiBold"],
      },
      colors: {
        parchment: "#E8D4B0",
        ink: "#1a0f0f",
      }
    },
  },
  plugins: [],
};
