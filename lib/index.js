const { PluginError } = require('gulp-util');
const replaceExt = require('replace-ext');
const through = require('through2');
const pug = require('pug');

module.exports = options => {
  const opts = {
    ...options
  };

  const compiler = opts.pug || opts.jade || pug;

  opts.data = {
    ...(opts.data || {}),
    ...(opts.locals || {
      pretty: false, // IMPORTANT: Not recommended! Disabled by default.
    })
  };

  return through.obj((file, encoding, callback) => {
    const output = file.clone();

    output.path = replaceExt(output.path, '.js');

    opts.filename = output.path;


    try {
      let data = `const pug=require('pug-runtime');module.exports=${
        compiler.compileFile(file.path, opts)
        };`;

      output.contents = Buffer.from(data);

      callback(null, output);
    } catch (ex) {
      const err = new PluginError('gulp-pug-module', ex.message);

      err.stack = ex.stack;

      callback(err, null);
    }
  });
};
