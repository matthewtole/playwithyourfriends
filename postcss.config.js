module.exports = {
  purge: ['./src/**/*.html', './src/**/*.tsx'],
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
