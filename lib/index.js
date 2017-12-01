const PluginError = require('gulp-util').PluginError;
const replaceExt = require('replace-ext');
const through = require('through2');
const pug = require('pug');

const PLUGIN_NAME = 'gulp-pug-module';

module.exports = (options) => {
  const opts = Object.assign({}, options);

  const compiler = opts.pug || opts.jade || pug;

  opts.data = Object.assign(opts.data || {}, opts.locals || {
    pretty: false, // IMPORTANT: Not recommended! Disabled by default.
  });

  return through.obj((file, encoding, callback) => {
    const output = file.clone();

    output.path = replaceExt(output.path, '.js');

    opts.filename = output.path;

    let data = 'const pug = require(\'pug-runtime\');\n\n';

    try {
      data += `module.exports = ${compiler.compileFile(file.path, opts)};\n`;

      output.contents = Buffer.from(data);

      callback(null, output);
    } catch (ex) {
      const err = new PluginError(PLUGIN_NAME, ex.message);

      err.stack = ex.stack;

      callback(err, null);
    }
  });
};
