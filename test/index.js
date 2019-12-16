const validator = require('html-validator');
const { expect } = require('chai');
const gulp = require('gulp');

const gulpPugModule = require('../');

describe('Gulp Pug Module', function () {
  it('should be a function', function () {
    expect(gulpPugModule).to.be.a('function');
  });

  it('should compile a simple layout to module', async function () {
    let template, html, messages;

    function compile () {
      return gulp.src('test/templates/source/simple.pug')
        .pipe(gulpPugModule())
        .pipe(gulp.dest('test/templates/dest'));
    }

    async function test () {
      template = require('./templates/dest/simple');
      html = template();

      const options = {
        data: html,
      };

      const validation = await validator(options);

      messages = JSON.parse(validation).messages;
    }

    await compile();
    await test();

    expect(template).to.be.a('function');
    expect(html).to.be.a('string');
    expect(messages).to.be.empty;
  });
});
