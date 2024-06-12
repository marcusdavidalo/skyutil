module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      textShadow: {
        bloom: "0 0 10px rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-xs": {
          textShadow: "0 0 2px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-sm": {
          textShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-md": {
          textShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-lg": {
          textShadow: "0 0 7px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-xl": {
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-2xl": {
          textShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
        },
        ".text-shadow-3xl": {
          textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
