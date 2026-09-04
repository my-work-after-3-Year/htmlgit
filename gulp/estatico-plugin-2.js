const merge = require('lodash.merge');

module.exports = function plugin({ defaults, options, task, env = {} }) {
  const gulp = require('gulp');

  let config = {};

  if (typeof options === 'function') {
    config = options(defaults(env));
  } else {
    config = merge({}, defaults(env), options);
  }

  if (env.watch && config.watch) {
    const watchConfig = merge(
      {},
      {
        task: task.bind(null, config, env),
      },
      config.watch
    );

    if (config.watch.watcher) {
      config.watch.watcher(watchConfig)();
    } else {
      const cb = {
        [config.watch.name]() {
          return watchConfig.task();
        },
      };

      gulp.watch(watchConfig.src, cb[config.watch.name]);
    }
  }

  return task.bind(null, config, env);
};
