const chalk = require('chalk');
const fancyLog = require('fancy-log');
const log = require('gulplog');

module.exports = function Logger(pluginName) {
  const info = (msg) => {
    log.info(chalk.cyan(pluginName), msg);
  };

  const debug = (msg, extendedMsg) => {
    log.debug(chalk.cyan(pluginName), msg, extendedMsg ? `\n${extendedMsg}` : '');
  };

  const error = (err, dev) => {
    const stack = err.stack ? `\n${chalk.red(err.stack)}` : '';

    fancyLog(
      chalk.cyan(pluginName),
      err.plugin ? chalk.cyan(`(${err.plugin})`) : '',
      err.fileName ? chalk.yellow(err.fileName) : '',
      chalk.red(err.message),
      stack
    );

    if (!dev) {
      process.exit(1);
    }
  };

  return {
    info,
    debug,
    error,
  };
};
