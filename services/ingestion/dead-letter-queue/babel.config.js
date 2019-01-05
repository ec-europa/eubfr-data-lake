module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.10',
        },
        modules: false,
        loose: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-flow-strip-types'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8.10',
            },
          },
        ],
      ],
    },
  },
};
