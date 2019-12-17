const validator = require('html-validator');
const { expect } = require('chai');
const gulp = require('gulp');

const gulpPugModule = require('../');

describe('Gulp Pug Module', function () {
  it('should be a function', function () {
    expect(gulpPugModule).to.be.a('function');
  });

  it('should compile a simple layout to module', async function () {
    const names = ['simple', 'locals', 'index'];
    const templates = [];
    const messages = [];
    const htmls = [];

    function compile () {
      return gulp.src(names.map(name => `test/templates/source/${name}.pug`))
        .pipe(gulpPugModule())
        .pipe(gulp.dest('test/templates/dest'));
    }

    async function test () {
      for (const name of names) {
        const template = require(`./templates/dest/${name}`);
        const html = template();

        templates.push(template);
        htmls.push(html);

        const options = {
          data: html
        };

        const validation = await validator(options);

        messages.push(...JSON.parse(validation).messages);
      }
    }

    await compile();
    await test();

    for (const template of templates) {
      expect(template).to.be.a('function');
    }

    for (const html of htmls) {
      expect(html).to.be.a('string');
    }

    expect(messages).to.be.empty;
  });
});
