/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ THIS LINE FIXES YOUR ISSUE
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};