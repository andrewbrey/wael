const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: { ...colors.stone },
      },
    },
  },
  plugins: [],
};
