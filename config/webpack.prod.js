const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname + '/config/postcss.config.js'
              }
            },
          },
          {
            loader: 'sass-loader'
          }
         ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('/css/style.css')
  ]
})
