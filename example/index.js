import("./example.wasm")
  .then(x => {
    console.log("ok");
  })
  .catch(err => {
    throw err;
  });
