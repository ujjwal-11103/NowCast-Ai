/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        primary: {
          DEFAULT: "#0A2472", // Deep Blue (Brand)
          foreground: "#ffffff",
          50: "#e6eaf3",
          100: "#cdd5e7",
          200: "#9badd0",
          300: "#6984b8",
          400: "#375ca0",
          500: "#0A2472",
          600: "#081d5b",
          700: "#061645",
          800: "#040e2e",
          900: "#020717",
        },
        secondary: {
          DEFAULT: "#0056D2", // Vibrant Blue (Action)
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#00C2CB", // Vibrant Cyan/Teal
          foreground: "#ffffff",
        },
        success: "#10B981", // Emerald
        warning: "#F59E0B", // Amber
        error: "#EF4444",   // Red
        info: "#3B82F6",    // Blue
        slate: {
          850: "#1bd1fc", // Custom dark slate
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
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
