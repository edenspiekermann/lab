"use strict";
var defaults = require('./nodemon.json');

module.exports = {
  NODE_ENV: process.env.NODE_ENV || defaults.env.NODE_ENV,
  API_URL: process.env.API_URL || defaults.env.API_URL,
  APP_URL: process.env.APP_URL || defaults.env.APP_URL
};
