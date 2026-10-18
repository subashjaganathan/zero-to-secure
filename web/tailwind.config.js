/*
 * Two themes, one accent. Neutral greys carry the layout; IBM Blue is the only
 * colour used for emphasis (primary actions, progress, focus). The priority
 * levels use muted green / amber / red, each checked for >= 4.5:1 contrast on
 * its own background.
 */
const shared = {
  "--rounded-box": "0.75rem",
  "--rounded-btn": "0.5rem",
  "--rounded-badge": "0.375rem",
  "--animation-btn": "0",
  "--animation-input": "0",
  "--btn-focus-scale": "1",
  "--border-btn": "1px",
  "--btn-text-case": "none",
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('daisyui'), require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        "front": "hsl(var(--front))",
        "back": "hsl(var(--back))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...shared,
          "--front": "220 14% 96%",
          "--back": "0 0% 100%",
          "base-100": "#ffffff",
          "base-200": "#f6f7f9",
          "base-300": "#e3e6eb",
          "base-content": "#161b26",
          primary: "#0f62fe",
          "primary-content": "#ffffff",
          secondary: "#4b5565",
          "secondary-content": "#ffffff",
          accent: "#0f62fe",
          "accent-content": "#ffffff",
          neutral: "#161b26",
          "neutral-content": "#ffffff",
          info: "#0f62fe",
          success: "#198038",
          "success-content": "#ffffff",
          warning: "#8e6a00",
          "warning-content": "#ffffff",
          error: "#da1e28",
          "error-content": "#ffffff",
        },
      },
      {
        dark: {
          ...shared,
          "--front": "220 10% 14%",
          "--back": "220 13% 9%",
          "base-100": "#0f1217",
          "base-200": "#161a21",
          "base-300": "#262b34",
          "base-content": "#e4e7ec",
          primary: "#78a9ff",
          "primary-content": "#0b1424",
          secondary: "#a2a9b6",
          "secondary-content": "#0f1217",
          accent: "#78a9ff",
          "accent-content": "#0b1424",
          neutral: "#e4e7ec",
          "neutral-content": "#0f1217",
          info: "#78a9ff",
          success: "#42be65",
          "success-content": "#07170c",
          warning: "#f1c21b",
          "warning-content": "#1c1500",
          error: "#ff8389",
          "error-content": "#2d0709",
        },
      },
    ],
  },
  safelist: [
    {
      pattern: /(badge|checkbox|toggle)-(success|warning|error|neutral)/,
      variants: ['checked'],
    }
  ],
};
