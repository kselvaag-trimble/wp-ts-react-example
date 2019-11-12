const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
    tidauth: './src/tidauth.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    port: 8081
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: "tidauth.html",
      chunks: ['tidauth']
    })
  ]
};
