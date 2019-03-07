const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const getAssetSource = (asset) => {
  let source = asset.source();
  if (Array.isArray(source)) {
    return source.join('\n');
  } else if (source instanceof ArrayBuffer) {
    return Buffer.from(source);
  }
  return source;
}

class WriteFilePlugin {
  constructor() {
    this.options = arguments.length > 0 ? arguments[0] : {};
  }

  apply(compiler) {

    compiler.hooks.afterEmit.tapAsync('WriteFilePlugin', (compilation, callback) => {

      Object.keys(compilation.assets).forEach(key => {

        const file = path.relative(process.cwd(), `${this.options.outputPath}/${key}`);

        mkdirp(path.dirname(file), (err) => {
          if (err) {
            console.log(err);
          } else {
            fs.writeFile(
              file,
              getAssetSource(compilation.assets[key]),
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        });
      });

      callback();
    });
  }
}

module.exports = WriteFilePlugin;