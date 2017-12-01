# gulp-pug-module

[Gulp](https://github.com/gulpjs/gulp) plugin to compile [Pug](https://pugjs.org) files to [Node.js](https://nodejs.org) [modules](https://nodejs.org/docs/latest-v6.x/api/modules.html).

This can be really useful if you have limited performance available (like [AWS Lambda](https://aws.amazon.com/lambda)) since Pug uses a considerable amount of resources to compile your files.

This will of course generate heavier files since the compiled modules contain all the imports and extends.

#### Size Difference Example

Take this simple Pug layout (`~74 bytes`):

```pug
doctype html

html
  head
    title Gulp Pug Module Test Layout

  body
```

Compiles to this module (`~1.1kB`):

```js
const pug = require('pug-runtime');

module.exports = function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;pug_debug_line = 1;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "\u003C!DOCTYPE html\u003E";
;pug_debug_line = 3;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "\u003Chtml\u003E";
;pug_debug_line = 4;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "\u003Chead\u003E";
;pug_debug_line = 5;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "\u003Ctitle\u003E";
;pug_debug_line = 5;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "Gulp Pug Module Test Layout\u003C\u002Ftitle\u003E\u003C\u002Fhead\u003E";
;pug_debug_line = 7;pug_debug_filename = "\u002Ftemplates\u002Fsource\u002Fsimple.pug";
pug_html = pug_html + "\u003Cbody\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;};
```

Quite a difference, but nothing to be alarmed of.


# Performance Difference Example

The [performance test](/test/perf.js) was done using relatively simple templates (you can find them in [/test/templates/source](/test/templates/source)) and the results are:

Test | Samples | Time
---|---|---
Using `require` (pre-compiled) | 1000 | 12.611ms
Using `compileFile` once | 1000 | 97.219ms
Using `compileFile` each loop | 1000 | 13723.192ms

Now, that's a difference.


## Installation

```sh
npm install --save-dev gulp-pug-module
```


### Important

You only need `pug-runtime` to use your pre-compiled templates:

```sh
npm install --save pug-runtime
```


## Usage in Gulp

Just require the module and add it to a pipe stage in a gulp task.

The options object is passed to the `compileFile` method used to compile the modules. See the [docs](https://pugjs.org/api/reference.html#pugcompilefilepath-options) for more information.

The `pretty` option is forced to `false` to avoid [unexpected bugs](https://pugjs.org/api/reference.html#options).

```js
const gulpPugModule = require('gulp-pug-module');
const gulp = require('gulp');
const del = require('del');

const PUG_OPTS = { // Pug's compileFile options object
  self: true,
};

gulp.task('clean', () => {
  del.sync('templates/dest');
});

gulp.task('templates', ['clean'], () => {
  gulp.src('templates/source/**/*.pug')
    .pipe(gulpPugModule(PUG_OPTS))
    .pipe(gulp.dest('templates/dest'));
});

gulp.task('default', ['templates']);
```

Your templates will now be Node.js modules that you can require.


## Usage in your app

```js
const layout = require('./templates/dest/layout');
const locals = {
  data: {
    // ...
  }
};

const html = layout(locals); // HTML string
```
