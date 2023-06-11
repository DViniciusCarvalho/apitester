const path = require('path');

module.exports = {
  entry: './src/ts/main.ts',
  output: {
    path: path.resolve(__dirname, 'build', 'js'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};