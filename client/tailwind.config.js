module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'white': '#ffffff',
        'mission-blue': '#002142',
        'mission-light-blue': '#0355a6',
        'mission-gray': '#f0f0f0',
        'dark-navy': '#0F172A',
        'dark-space-blue': '#192136',
        'energy-yellow': '#efd055',
      },
      fontFamily: {
        sans: [
          '"Inter var"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ]
      },
      height: {
        '108': '28rem',
        '116': '34rem'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addVariant }) {
      addVariant('energy', '.energy &')
    },
  ]
}
