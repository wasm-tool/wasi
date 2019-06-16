module.exports = {
  entry: "./index.js",
  output: {
    publicPath: "dist/"
  },
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
  }
};
