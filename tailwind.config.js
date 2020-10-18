module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  theme: {
    fontFamily: {
      title: ['Bungee', 'sans-serif'],
      body: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        brand: {
          50: '#a8cdea',
          100: '#8db6d7',
          200: '#72a0c4',
          300: '#5889b0',
          400: '#3d739d',
          500: '#225c8a',
          600: '#1a4568',
          700: '#112e45',
          800: '#091723',
          900: '#000000',
        },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
    borderColor: ['responsive', 'hover', 'focus', 'disabled'],
    textColor: ['responsive', 'hover', 'focus', 'disabled'],
  },
  purge: {
    // enabled: true,
    content: ['./src/**/*.html', './src/**/*.tsx'],
  },
};
