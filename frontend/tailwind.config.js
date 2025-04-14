// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          oceanTeal: '#486C70',
          sageGreen: '#8BA89D',
        },
        accent: {
          beige: '#D8D2C1',
          warmBrick: '#7C4E48',
          deepPlum: '#3E2C33'
        },
        neutral: {
          offBlack: '#2B2B2B',
          lightGray: '#F5F5F5'
        }
      },
    },
  },
  plugins: [],
}