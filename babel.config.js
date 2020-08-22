module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'commonjs' : false,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: ['react-hot-loader/babel'],
  };
};
