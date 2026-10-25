// Theme colors are CSS variables (see src/index.css). This helper lets Tailwind's opacity
// modifiers work with them, e.g. `bg-accent/10` -> color-mix(... 10% of --accent ...).
const withAlpha = (variable) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `var(${variable})`
    : `color-mix(in srgb, var(${variable}) calc(${opacityValue} * 100%), transparent)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Centered content column with comfortable side padding
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1264px' },
    },
    extend: {
      colors: {
        bg: withAlpha('--bg'),
        accent: withAlpha('--accent'),
        'accent-ink': withAlpha('--accent-ink'),
        'accent-soft': 'var(--accent-soft)',
        accent2: withAlpha('--accent2'),
        danger: withAlpha('--danger'),
        stroke: withAlpha('--stroke'),
        'stroke-strong': withAlpha('--stroke-strong'),
        panel: withAlpha('--panel'),
        panel2: withAlpha('--panel2'),
        text: withAlpha('--text'),
        muted: withAlpha('--muted'),
        muted2: withAlpha('--muted2'),
        fill: 'var(--fill-1)',
        'fill-strong': 'var(--fill-2)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
