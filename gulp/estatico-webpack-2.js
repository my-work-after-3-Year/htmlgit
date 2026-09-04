const Plugin = require('./estatico-plugin-2');
const Logger = require('./estatico-logger');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

const defaults = () => ({
  webpack: webpackConfig,
  logger: new Logger('estatico-webpack'),
});

const task = (config, env = {}, cb) => {
  const compiler = webpack(config.webpack);

  const callback = (error, stats) => {
    if (error) {
      return cb(error);
    }

    if (!stats) {
      return cb(new Error('Webpack reported no stats output.'));
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      cb(info.errors);
    } else {
      cb();
    }

    if (!env.watch) {
      compiler.close((err) => {
        if (err) {
          config.logger.error(err);
        }
      });
    }
    return compiler;
  };

  if (env.watch) {
    compiler.watch({}, callback);
  } else {
    compiler.run(callback);
  }
};

module.exports = (options, env = {}) =>
  new Plugin({
    defaults,
    options,
    task,
    env,
  });

module.exports.webpack = webpack;
