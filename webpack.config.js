const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { resolve: _resolve } = require('path');

const env = require('minimist')(process.argv.slice(2));

module.exports = [
  {
    entry: {
      head: './src/assets/js/head.ts',
      main: './src/assets/js/main.ts',
      mainMinimal: './src/assets/js/mainMinimal.ts',
    },
    output: {
      path: _resolve('./dist/assets/js'),
      filename: `[name]${env.dev ? '' : '.min'}.js`,
      chunkFilename: `async/[name]${env.dev ? '' : '.min'}.js`,
      publicPath: '/assets/js/',
    },
    mode: env.dev ? 'development' : 'production',
    module: {
      rules: [
        {
          use: 'handlebars-loader',
          test: /\.hbs$/,
        },
        {
          use: 'babel-loader',
          test: /(\.js|\.jsx)$/, 
          exclude: /node_modules/,
        },
        {
          use: 'ts-loader',
          test: /(\.ts)$/, 
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx'],
      alias: {
        handlebars: 'handlebars/runtime.js',
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
        logLevel: 'warn',
      }),
      new UnminifiedWebpackPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_fnames: true,
        },
      })],
    },
  },
  {
    entry: {
      dev: './src/preview/assets/js/dev.ts',
    },
    module: {
      rules: [
        {
          use: 'ts-loader',
          test: /\.tsx?$/,
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: _resolve('./dist/preview/assets/js'),
      filename: '[name].js',
    },
    mode: 'development',
  },
];
