import type { Config } from 'tailwindcss'

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
} satisfies Config

