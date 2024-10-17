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
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          200: '#e5e7eb',
          600: '#4b5563',
          900: '#111827',
        },
        gradientColorStops: {
          'blue-50': '#eff6ff',
          'indigo-100': '#e0e7ff',
        },
      },
    },
  },
  plugins: [],
};
export default config;
