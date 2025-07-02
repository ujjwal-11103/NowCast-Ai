/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ───────────────────────────────────────── Colors ───────────────────────────────────────── */
      colors: {
        primary: {
          DEFAULT: "#0A2472",
          foreground: "hsl(var(--primary-foreground))",
        },
      },

      /* ──────────────────────────────────────── Keyframes ─────────────────────────────────────── */
      keyframes: {
        /* Accordion (existing) */
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        /* New, page‑level animations */
        "slide-fade-in": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12%)" },
        },
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-slow": {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },

      /* ─────────────────────────────────────── Animations ─────────────────────────────────────── */
      animation: {
        /* Accordion */
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up   0.2s ease-out",

        /* Page‑level */
        "slide-fade-in": "slide-fade-in 0.6s ease-out both",
        float: "float 8s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 14s ease-in-out infinite",
      },
    },
  },

  /* ───────────────────────────────────────── Plugins ─────────────────────────────────────────── */
  plugins: [require("tailwindcss-animate")],
}
