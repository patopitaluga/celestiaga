const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: ((process.env.NODE_ENV && process.env.NODE_ENV === 'development') ? 'development' : 'production'), /* Documentation: https://webpack.js.org/concepts/mode/ */
  entry: {
    'script': './src/src-script.js',

    // 'style': './src/style.scss',
  },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  performance: { hints: false }, /* If it's not disabled will warning that the bundle file is too big, but we need that asset. */
  devtool: 'source-map',
};
