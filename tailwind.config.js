/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        verdana: ["Verdana", "sans-serif"],
        cabin: ["Cabin", "sans-serif"],
        "cabin-condensed": ["Cabin Condensed", "sans-serif"],
        "source-serif": ["Source Serif", "serif"],
      },
    },
  },
  plugins: [],
};
