import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",


    // HeroUI,
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  // HeroUI,
  darkMode: "class",
  plugins: [heroui()],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
        digit: ["var(--font-digital)"],
      },
      keyframes: {
        appear: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        sway: {
          "0%, 100%": {
            transform: "rotate(-2deg)",
          },
          "50%": {
            transform: "rotate(2deg)",
          },
        },
        spasm: {
          "0%": {
            transform: "rotate(0deg)"
          }
          , "10%": {
            transform: "rotate(5deg)"
          }
          , "20%": {
            transform: "rotate(-5deg)"
          }
          , "30%": {
            transform: "rotate(3deg)"
          }
          , "40%": {
            transform: "rotate(-3deg)"
          }
          , "50%": {
            transform: "rotate(1deg)"
          }
          , "60%": {
            transform: "rotate(-1deg)"
          }
          , "70%": {
            transform: "rotate(2deg)"
          }
          , "80%": {
            transform: "rotate(-2deg)"
          }
          , "90%": {
            transform: "rotate(0.5deg)"
          }
          , "100%": {
            transform: "rotate(0deg)"
          }
        },
      },
      animation: {
        sway: "sway 2s ease-in-out infinite",
        spasm: "spasm 2s ease-in-out infinite",
        appear: "appear 0.5s ease-in-out both",
      },
    },
  },
} satisfies Config;
