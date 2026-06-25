import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        card: "var(--bg-card)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          glow: "var(--accent-glow)",
        },
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        drift: "drift 10s infinite alternate ease-in-out",
        "drift-reverse": "drift 13s infinite alternate-reverse ease-in-out",
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out 1s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        ripple: "ripple 0.6s ease-out",
        "dash-flow": "dash-flow 1.5s linear infinite",
      },
      keyframes: {
        drift: {
          from: { transform: "translate(0,0) scale(1)" },
          to: { transform: "translate(80px,60px) scale(1.15)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      backdropBlur: {
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
