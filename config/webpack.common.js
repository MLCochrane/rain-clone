const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = ['newpage'];
const pages = paths.map(el => {
  return new HtmlWebpackPlugin({
    filename: `${el}/index.html`, // specify filename or else will overwrite default index.html
    inject: {},
    template: `src/views/pages/${el}.hbs`,
    templateParameters: {
      // Makes 'asset_path' an accesible variable in templates for appending file/image paths based on env
      'asset_path': process.env.npm_lifecycle_event === 'dev' ? './src' : '',
    }
  })
});

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
    new HtmlWebpackPlugin({
      inject: {},
      template: "src/views/pages/index.hbs"
    }),
  ].concat(pages)
}
