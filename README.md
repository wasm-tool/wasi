# wasm-tool/wasi

Import WebAssembly modules that expose the WebAssembly System Interface (WASI).

## Installation

```
npm install --save-dev @wasm-tool/wasi
```

## Usage: webpack

Include the following rule in your webpack configuration:

```js
{
  // ...
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
  // ...
}
```

We need to set the `type` to JavaScript to bypass webpack's wasm support (as a workaround, for now). Which will also prevent the loading to work correclty in non-web environements.
