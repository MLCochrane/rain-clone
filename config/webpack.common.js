const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModernizerWebpackPlugin = require('modernizr-webpack-plugin');

const modernizrConfig = {
  minify: {
    compress: {
      loops: true
    },
    mangle: {},
    output: {
      comments: true
    }
  },
  'feature-detects': [
    'input',
    'canvas',
    'css/resize'
  ]
}

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules | bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
       test: /\.(png|svg|jpg|gif)$/,
       use: [
         {
           loader: 'file-loader'
         }
       ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*.*'], {root: 'C:/Users/Luke Cochrane/Desktop/Projects/For testing/learning-webpack'}),
    new HtmlWebpackPlugin({
     title: 'Learning Webpack',
     inject: {},
     template: "src/index.html"
    }),
    new ModernizerWebpackPlugin(modernizrConfig)
  ]
}
