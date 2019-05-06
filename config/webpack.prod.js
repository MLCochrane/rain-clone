const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader'
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin('/css/style.css')
  ]
})
