const Plugin = require('./estatico-plugin-2');
const Logger = require('./estatico-logger');

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed-in-place');
const eslint = require('gulp-eslint');
const through = require('through2');
const chalk = require('chalk');
const path = require('path');

const defaults = (env) => ({
  src: null,
  srcBase: null,
  dest: null,
  watch: null,
  plugins: {
    eslint: {
      fix: env.fix,
    },
    changed: {
      firstPass: true,
    },
  },
  logger: new Logger('estatico-eslint-2'),
});

const task = (config, env = {}) =>
  gulp
    .src(config.src, {
      base: config.srcBase,
    })
    .pipe(plumber())
    .pipe(config.plugins.changed ? changed(config.plugins.changed) : through.obj())
    .pipe(eslint(config.plugins.eslint).on('error', (err) => config.logger.error(err, env.dev)))
    .pipe(eslint.formatEach())
    .pipe(
      through.obj((file, enc, done) => {
        if (file.eslint && (file.eslint.errorCount > 0 || file.eslint.fixed)) {
          const relFilePath = path.relative(config.srcBase, file.path);

          if (file.eslint.errorCount > 0) {
            config.logger.error(
              {
                message: 'Linting error (details above)',
                fileName: relFilePath,
              },
              env.dev
            );
          }

          if (file.eslint.fixed) {
            config.logger.info(
              `Automatically fixed linting issues in ${chalk.yellow(relFilePath)}. Set "plugins.eslint.fix" to false to disable this functionality.`
            );

            return done(null, file);
          }
        }

        return done();
      })
    )
    .pipe(config.plugins.eslint.fix ? gulp.dest(config.dest) : through.obj());

module.exports = (options, env = {}) =>
  new Plugin({
    defaults,
    options,
    task,
    env,
  });
