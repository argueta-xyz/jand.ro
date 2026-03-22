const themeColors = require('./theme/colors.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{njk,html,md,js}',
    './src/_data/**/*.js',
    './src/_data/**/*.json',
  ],
  safelist: ['text-secondary', 'hero-secondary-glow', 'text-tertiary', 'hero-tertiary-glow'],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'serif'],
        mono: [
          '"Chivo Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        label: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
