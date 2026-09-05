import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surfaceElevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        link: "rgb(var(--color-link) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-family)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "heading-lg": ["2rem", { lineHeight: "1.3" }],
        heading: ["1.5rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      maxWidth: {
        container: "75rem",
        prose: "48rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        card: "1rem",
        button: "3rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.2)",
        cardHover: "0 8px 24px rgba(0, 0, 0, 0.3)",
        accent: "0 4px 16px rgb(var(--color-accent) / 0.3)",
        accentHover: "0 6px 24px rgb(var(--color-accent) / 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
