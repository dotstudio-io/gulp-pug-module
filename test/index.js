const validator = require('html-validator');
const expect = require('chai').expect;
const gulp = require('gulp');

const gulpPugModule = require('../');

describe('Gulp Pug Module', () => {
  it('should be a function', () => {
    expect(gulpPugModule).to.be.a('function');
  });

  it('should compile a simple layout to module', (done) => {
    gulp.task('default', () => {
      return gulp.src('test/templates/source/simple.pug')
        .pipe(gulpPugModule())
        .pipe(gulp.dest('test/templates/dest'));
    });

    gulp.task('test', ['default'], () => {
      const tpl = require('./templates/dest/simple');

      expect(tpl).to.be.a('function');

      const html = tpl();

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
