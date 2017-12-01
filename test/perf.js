const gulp = require('gulp');
const pug = require('pug');

const gulpPugModule = require('../');

const TIME_REQUIRE = 'Using `require` (pre-compiled)';
const TIME_COMPILE_ONCE = 'Using `compileFile` once';
const TIME_COMPILE_EACH = 'Using `compileFile` each loop';

const SAMPLES = 1000;

const locals = {
  title: 'Some title',
};

gulp.task('default', () => {
  return gulp.src('test/templates/source/index.pug')
    .pipe(gulpPugModule({
      self: true
    }))
    .pipe(gulp.dest('test/templates/dest'));
});

gulp.task('test', ['default'], () => {
  /* Using `require` (pre-compiled) */
  console.time(TIME_REQUIRE);

  for (let i = 0, l = SAMPLES; i < l; i += 1) {
    require('./templates/dest')(locals);
  }

  console.timeEnd(TIME_REQUIRE);

  /* Using `compileFile` once */
  console.time(TIME_COMPILE_ONCE);

  const tpl = pug.compileFile('test/templates/source/index.pug');

  for (let i = 0, l = SAMPLES; i < l; i += 1) {
    tpl(locals);
  }

  console.timeEnd(TIME_COMPILE_ONCE);

  /* Using `compileFile` each loop */
  console.time(TIME_COMPILE_EACH);

  for (let i = 0, l = SAMPLES; i < l; i += 1) {
    pug.compileFile('test/templates/source/index.pug')(locals);
  }

  console.timeEnd(TIME_COMPILE_EACH);
});

gulp.start('test');
