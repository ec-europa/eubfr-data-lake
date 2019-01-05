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
      '@babel/preset-env',
    ],
  ],
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
          '@babel/preset-env',
        ],
      ],
    },
  },
};
