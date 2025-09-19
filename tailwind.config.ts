import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./pages/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
 theme: {
          extend: {
            colors: {
              primary: "#DC143C",
              sky: "#38BDF8",
              gold: "#D4AF37",
              dark: "#0f172a",
              light: "#f8fafc",
              glass: "rgba(255,255,255,0.6)",
            },
            fontFamily: {
              sans: [
                "Roboto",
                "system-ui",
                "-apple-system",
                "Segoe UI",
                "Arial",
              ],
            },
          },
        },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
