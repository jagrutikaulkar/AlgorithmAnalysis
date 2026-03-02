/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#8b7ff7",
          500: "#6e5ef5",
          600: "#5647d6",
        },
        surface: {
          900: "#0b0f1a",
          800: "#111827",
          700: "#1a2235",
          600: "#233044",
          500: "#2d3f57",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
