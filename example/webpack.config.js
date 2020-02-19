const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  module: {
    rules: [
      {
        test: /\.wasm/,
        type: "javascript/auto",
        use: {
          loader: "@wasm-tool/wasi"
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};
