/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FC",
          100: "#D7E8F6",
          200: "#B0D1ED",
          300: "#88BAE3",
          400: "#61A3DA",
          500: "#4988C4", // base
          600: "#3E73A7",
          700: "#335E8A",
          800: "#28496D",
          900: "#1E3650",
          950: "#132233",
        },
        secondary: {
          50: "#fff6e6",
          100: "#ffeccc",
          200: "#ffd999",
          300: "#ffc666",
          400: "#ffb733",
          500: "#fbb728",
          600: "#e2a424",
          700: "#c99220",
          800: "#a97a1a",
          900: "#886214",
          950: "#5a410d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
