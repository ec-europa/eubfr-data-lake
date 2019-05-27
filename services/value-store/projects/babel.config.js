module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        modules: false,
        loose: true,
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '10',
            },
          },
        ],
      ],
    },
  },
};
