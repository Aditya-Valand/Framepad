/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F5F5F0',
        'frame-white': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-muted': '#888880',
        'border-gray': '#E0DED8',
      },
    },
  },
  plugins: [],
}
