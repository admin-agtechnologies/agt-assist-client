import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vert WhatsApp
        wgreen: "#25D366",
        wdark: "#075E54",
        wlight: "#DCF8C6",
        wmid: "#128C7E",
        // Violet AGT-Voice
        vprimary: "#6C3CE1",
        vdark: "#2D1B69",
        vlight: "#EDE7F9",
        vmid: "#8B5CF6",
        // Brand AGT
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#25D366",
          600: "#128C7E",
          700: "#075E54",
          900: "#022c22",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.1)",
        modal: "0 20px 60px -10px rgb(0 0 0 / 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "zoom-in": "zoomIn 0.2s ease-out",
        spin: "spin 0.8s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        zoomIn: { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};

export default config;
