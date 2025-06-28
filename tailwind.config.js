/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  assets: ['./assets/fonts/'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins-Regular"],
      },
    },
  },
  plugins: [],
};
