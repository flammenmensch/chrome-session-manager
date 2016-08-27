var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'page-action.bundle': './js/page-action/index.js',
    'background.bundle': './js/background/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: 'public', from: '**/*' }
    ])
  ]
};
