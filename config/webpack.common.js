const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModernizerWebpackPlugin = require('modernizr-webpack-plugin');

const modernizrConfig = {
  minify: {
    toplevel: true,
    compress: {
      loops: true
    },
    mangle: {},
    output: {
      comments: false
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
    app: ['@babel/polyfill', './src/app.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules | bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true
            }
          }
        ] 
      },
      {
        test: /\.(hbs|handlebars)/,
        use: [
          {
            loader: 'handlebars-loader',
            query: {
              partialDirs: [path.join(__dirname, '../', 'src/views', 'partials')],
              helperDirs: [path.join(__dirname, '../', 'src/views', 'helpers')]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*'], {root: path.join(__dirname, '../')}),
    new HtmlWebpackPlugin({
      inject: {},
      template: "src/views/pages/index.hbs"
    }),
    new HtmlWebpackPlugin({
      filename: 'people/index.html', // specify filename or else will overwrite default index.html
      inject: {},
      template: "src/views/pages/people.hbs"
    }),
    new HtmlWebpackPlugin({
      filename: 'places/index.html', // specify filename or else will overwrite default index.html
      inject: {},
      template: "src/views/pages/places.hbs"
    }),
    new HtmlWebpackPlugin({
      filename: 'things/index.html', // specify filename or else will overwrite default index.html
      inject: {},
      template: "src/views/pages/things.hbs"
    }),
    new ModernizerWebpackPlugin(modernizrConfig)
  ]
}
