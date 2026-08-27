/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2A22",
        cream: "#FBF8F1",
        market: {
          50: "#EEF5EE",
          100: "#D7E8D8",
          200: "#AECFB1",
          300: "#7FB185",
          400: "#4E8F58",
          500: "#2E6E3B",
          600: "#1F5730",
          700: "#184426",
          800: "#12331D",
          900: "#0C2214",
        },
        mango: {
          50: "#FDF3E2",
          100: "#FAE3B8",
          200: "#F5CA7D",
          300: "#EFB04A",
          400: "#E8A33D",
          500: "#D68A22",
          600: "#B06E18",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        logo: ["'Baloo 2'", "'Fraunces'", "serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
