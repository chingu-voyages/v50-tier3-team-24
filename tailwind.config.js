/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gloria: ["Gloria Hallelujah", "sans-serif"],
        verdana: ["Verdana", "sans-serif"],
        cabin: ["Cabin Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};
