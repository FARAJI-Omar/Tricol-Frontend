// custom theme colors and fonts for Tailwind CSS

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "secondary-red": "#ef4444",
        "accent-yellow": "#eab308",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
