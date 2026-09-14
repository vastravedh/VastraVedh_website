import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // VastraVedh brand palette (from logo)
        maroon: {
          DEFAULT: "#7B0F2B",
          light: "#9B1B3C",
          dark: "#5C0A20",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#D4AF37",
          dark: "#A6851C",
        },
        cream: {
          DEFAULT: "#F7F2E7",
          dark: "#EFE7D2",
        },
        ink: "#2B1A1F",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(123, 15, 43, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
