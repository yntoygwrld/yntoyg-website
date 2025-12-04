import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // YG Brand Colors - Gentleman aesthetic
        'yg-gold': '#D4AF37',
        'yg-navy': '#09090b',
        'yg-cream': '#F5F5DC',
        'yg-burgundy': '#722F37',
        'yg-forest': '#228B22',
      },
      fontFamily: {
        'serif': ['var(--font-playfair)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'sans': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
