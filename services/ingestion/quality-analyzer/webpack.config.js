const slsw = require('serverless-webpack');
const path = require('path');

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'source-map',
  target: 'node',
  externals: [{ 'aws-sdk': true }],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
