/*
    ./webpack.config.js
*/
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');


const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'bundle.[hash].js'
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      // { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { test: /\.js$/, loader: "source-map-loader", enforce: "pre" }
    ]
  },
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:8000"
      }
    }    
  },
  plugins: [
      HtmlWebpackPluginConfig,
      new ExtractTextPlugin("styles.css")
      // ,new TsConfigPathsPlugin(/* { tsconfig, compiler } */)

    ],
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
      "react": "React",
      "react-dom": "ReactDOM"
  }
}

