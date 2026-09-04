const chalk = require('chalk');

const format = (stats) =>
  stats.toString({
    colors: chalk.supportsColor,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: true,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false,
    assetsSort: 'name',
  });

module.exports = format;
