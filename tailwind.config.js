/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'anchormatch': {
          blue: '#1e40af',
          green: '#059669',
          light: '#f0f9ff',
        },
        // Backwards compatibility
        'northside': {
          blue: '#1e40af',
          green: '#059669',
          light: '#f0f9ff',
        }
      }
    },
  },
  plugins: [],
}