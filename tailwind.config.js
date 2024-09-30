/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        JotiOne: ["Joti One", "cursive"],
        Inter: ["Inter", "sans-serif"],
      },
      container: {
        center: true,
      },
      no_scrollbar: {
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
    },
  },
  plugins: [],
};
