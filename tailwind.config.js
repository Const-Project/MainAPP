/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        "gray-100": "#F5F5F5",
        "gray-200": "#EEEEEE",
        "gray-300": "#E0E0E0",
        "gray-400": "#BDBDBD",
        "gray-500": "#9E9E9E",
        "gray-600": "#757575",
        "gray-700": "#616161",
        "gray-800": "#424242",
        "gray-900": "#212121",
      },
    },
  },
  plugins: [],
};

