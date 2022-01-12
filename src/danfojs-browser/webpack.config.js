/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");

const createConfig = (target) => {
  return {
    mode: "production",
    devtool: "source-map",
    context: path.resolve(__dirname),
    entry: {
      index: `./src/index.ts`
    },
    target: target,
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: `bundle.js`,
      library: "dfd"
    },
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: [ 'buffer', 'Buffer' ]
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [ 'ts-loader', 'ify-loader' ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      fallback: {
        "fs": false,
        "path": require.resolve("path-browserify"),
        "dotenv": require.resolve('dotenv'),
        "os": require.resolve('os-browserify/browser'),
        "stream": require.resolve('stream-browserify'),
        "buffer": require.resolve('buffer'),
        "crypto": require.resolve('crypto-browserify'),
        "http": require.resolve('stream-http'),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "net": false,
        "tls": false
      }
    }
  };
};

module.exports = [ createConfig("web") ];
