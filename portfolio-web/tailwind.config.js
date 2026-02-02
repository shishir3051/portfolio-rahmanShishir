export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        stroke: 'var(--stroke)',
        panel: 'var(--panel)',
        panel2: 'var(--panel2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        muted2: 'var(--muted2)',
      },
    },
  },
  plugins: [],
}
