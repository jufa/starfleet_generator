const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const webpack = require('webpack').default;

module.exports = {
  entry: {
    app: './builder.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    // Terms page
    new HtmlWebpackPlugin({
      template: 'terms.html',
      filename: 'terms.html', // Output in dist/terms.html
      inject: false,
    }),
    new CopyWebpackPlugin([
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    )
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
