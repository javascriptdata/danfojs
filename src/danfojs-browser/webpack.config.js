/* eslint-disable no-undef */
const path = require("path");

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
        "os": require.resolve('os-browserify/browser')
      }
    }
  };
};

module.exports = [ createConfig("web") ];
