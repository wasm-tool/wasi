const { writeFileSync, existsSync, mkdirSync } = require("fs");
const { join, basename } = require("path");
const loaderUtils = require("loader-utils");

module.exports = function(bin) {
  this.addDependency(this.resourcePath);

  const options = loaderUtils.getOptions(this) || {};

  const publicPath =
    typeof options.publicPath === "string"
      ? options.publicPath === "" || options.publicPath.endsWith("/")
        ? options.publicPath
        : `${options.publicPath}/`
      : typeof options.publicPath === "function"
      ? options.publicPath(this.resourcePath, this.rootContext)
      : this._compilation.outputOptions.publicPath || "dist";

  if (!existsSync(publicPath)) {
      mkdirSync(publicPath);
  }

  const wasmPath = join(publicPath, basename(this.resourcePath));
  writeFileSync(wasmPath, bin);

  return `
    const { WASI } = require("@wasmer/wasi");
    const Wasmfs = require("@wasmer/wasmfs").default;

    const fs = new Wasmfs;
    const textDecoder = new TextDecoder("utf-8");

    export async function then(cb) {
      const env = {};

      const oldWriteSync = fs.fs.writeSync;
      fs.fs.writeSync = function (fd, buffer, ...rest) {
        if (fd === 1) {
          const str = textDecoder.decode(buffer);
          console.log(str);
          return buffer.length;
        }
        if (fd === 2) {
          const str = textDecoder.decode(buffer);
          console.error(str);
          return buffer.length;
        }

        return oldWriteSync(fd, buffer, ...rest);
      }

      const wasi = new WASI({
          args: ["${wasmPath}"],
          env,
          bindings: {
            ...WASI.defaultBindings,
            fs: fs.fs,
          }
      });

      const imports = {
        wasi_unstable: wasi.wasiImport,
        env
      };

      const { instance } =
        await WebAssembly.instantiateStreaming(fetch("${wasmPath}"), imports);
      wasi.start(instance);

      cb(instance.exports);
    }
  `;
};
module.exports.raw = true;
