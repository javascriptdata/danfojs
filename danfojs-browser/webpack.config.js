/* eslint-disable no-undef */
const path = require("path");

const createConfig = (target) => {
  return {
    mode: "production",
    devtool: "source-map",
    context: path.resolve(__dirname),
    entry: {
      index: `./src/index.js`
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
          use: {
            loader: "babel-loader",
            options: { presets: [ "@babel/preset-env" ] }
          },
          test: /\.(js|jsx)$/,
          exclude: /node_modules/
        }
      ]
    },
    node: {
      fs: "empty"
    }
  };
};

module.exports = [ createConfig("web") ];
