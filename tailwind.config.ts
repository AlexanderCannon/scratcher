import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        tt: "60vh",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
