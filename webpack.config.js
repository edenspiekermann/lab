"use strict";
var webpack = require('webpack');
var ENV = require('./.env.js');

var webpackENV = Object.keys(ENV).reduce(function(env, key) {
  env[key] = JSON.stringify(ENV[key]);
  return env;
}, {});

module.exports = {
  entry: './app/browser.jsx',
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': webpackENV
    })
  ]
};
