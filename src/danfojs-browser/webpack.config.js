/* eslint-disable no-undef */
const path = require("path");

const createConfig = () => {
  return {
    mode: "production",
    devtool: "source-map",
    context: path.resolve(__dirname),
    entry: {
      index: `./src/index.ts`
    },
    target: "web",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "bundle.js",
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
      extensions: [ '.tsx', '.ts', '.js' ]
    }
  };
};

module.exports = [
  createConfig()
];
