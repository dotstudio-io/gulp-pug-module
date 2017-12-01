const validator = require('html-validator');
const expect = require('chai').expect;
const pugModule = require('../');
const gulp = require('gulp');

describe('Gulp Pug Module', () => {
  it('should be a function', () => {
    expect(pugModule).to.be.a('function');
  });

  it('should compile a simple layout to module', (done) => {
    gulp.task('default', () => {
      gulp.src('test/templates/source/**/*.pug')
        .pipe(pugModule())
        .pipe(gulp.dest('test/templates/dest'));
    });

    gulp.task('test', ['default'], () => {
      const layout = require('./templates/dest/layout');

      expect(layout).to.be.a('function');

      const html = layout();

      expect(html).to.be.a('string');

      const options = {
        data: html,
      };

      validator(options)
        .then((data) => {
          const messages = JSON.parse(data).messages;

          if (messages.length) {
            messages.forEach((msg, i) => {
              const err = new Error(msg.message);

              err.stack += `\nValidation Error (${i + 1}/${messages.length}):\n`;

              Object.keys(msg).forEach((key) => {
                err.stack += `    ${key}: ${msg[key]}\n`;
              });

              console.error(err);
            });
          }

          expect(messages).to.be.empty;

          done();
        })
        .catch(err => done(err));
    });

    gulp.start('test');
  });
});
