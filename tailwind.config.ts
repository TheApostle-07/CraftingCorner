import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        walnut: '#6E4B34',
        ivory: '#F7F1E8',
        charcoal: '#2B2622',
        clay: '#A16A43',
        brass: '#B8894E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: '1.5rem',
        't-brand': '1.5rem 1.5rem 0 0',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(18px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.7s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
