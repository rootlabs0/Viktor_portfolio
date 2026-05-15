/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    // Disable Tailwind's CSS reset so it doesn't break existing styles
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
