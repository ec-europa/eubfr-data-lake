const path = require('path');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'development',
  optimization: { minimize: false },
  devtool: 'source-map',
  externals: [{ 'aws-sdk': true }],
  module: {
    rules: [
      // graphql-compose-elasticsearch publishes mjs and builds cjs.
      {
        test: /\.cjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: './src/api/6_3.js',
          to: './src/api/6_3.js',
          toType: 'file',
        },
      ],
      {}
    ),
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
