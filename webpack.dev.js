// var path = require('path');
// var webpack = require('webpack');

// module.exports = {
//   entry: './builder.js',
//   output: {
//       path : path.join(__dirname, './'),
//       filename: 'bundle.js'
//   },
//   module: {
//       loaders: [
//         {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
//       ]
//   },
//   plugins: [
//       // Avoid publishing files when compilation fails
//       new webpack.NoEmitOnErrorsPlugin()
//   ],
//   stats: {
//       // Nice colored output
//       colors: true
//   },
//   // Create Sourcemaps for the bundle
//   devtool: 'source-map',
// };

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './'
  }
});