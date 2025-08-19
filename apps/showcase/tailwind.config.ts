import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  safelist: ["dark", "light"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: "var(--font-geist-mono)",
        waldenburg: ["var(--font-waldenburg)", "var(--font-waldenburg-hf)"],
        waldenburghf: "var(--font-waldenburg-hf)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            p: { marginTop: "0.4em", marginBottom: "0.4em" },
            h1: { marginTop: "1em", marginBottom: "0.4em" },
            h2: { marginTop: "0.9em", marginBottom: "0.4em" },
            h3: { marginTop: "0.8em", marginBottom: "0.35em" },
            h4: { marginTop: "0.7em", marginBottom: "0.3em" },
            ul: { marginTop: "0.4em", marginBottom: "0.4em" },
            ol: { marginTop: "0.4em", marginBottom: "0.4em" },
            li: { marginTop: "0.15em", marginBottom: "0.15em" },
            blockquote: { marginTop: "0.5em", marginBottom: "0.5em" },
            pre: { marginTop: "0.6em", marginBottom: "0.6em" },
            img: { marginTop: "0.5em", marginBottom: "0.5em" },
            table: { marginTop: "0.6em", marginBottom: "0.6em" },
            hr: { marginTop: "0.9em", marginBottom: "0.9em" },

            // Collapse leading/trailing whitespace
            ["> :first-child"]: { marginTop: "0" },
            ["> :last-child"]: { marginBottom: "0" },

            // Tighten paragraph-to-list gap
            "p + ul": { marginTop: "0.3em" },
            "p + ol": { marginTop: "0.3em" },
            "ul + p": { marginTop: "0.3em" },
            "ol + p": { marginTop: "0.3em" },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
