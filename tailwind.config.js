/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./Navigation/**/*.{js,jsx,ts,tsx}",
    "./Header/**/*.{js,jsx,ts,tsx}",
    "./TemplateComponent/**/*.{js,jsx,ts,tsx}",
  ],
  assets: ['./assets/fonts/'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins-Regular"],
        'poppins-bold': ['Poppins-Bold'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    fontFamily: true,
  },
};
