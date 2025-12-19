/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f0f7",
          100: "#cce1ef",
          200: "#99c3df",
          300: "#66a5cf",
          400: "#3387bf",
          500: "#025591",
          600: "#024d83",
          700: "#024475",
          800: "#013a66",
          900: "#013158",
          950: "#001f3a",
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
