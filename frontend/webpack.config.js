const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium'),
          to: 'Cesium'
        },
        {
          from: path.resolve(__dirname, 'public/index.html'),
          to: 'index.html'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {"fs": false}
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: './dist',
  },
};
