/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#F5F5F5",
        danger: "#FF4C4C",
        success: "#4CAF50",
        muted: "#9E9E9E",
      },
    },
  },
  plugins: [],
};
