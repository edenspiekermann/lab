/* jshint node:true */
"use strict";
require('node-jsx').install({ extension: '.jsx', harmony: true });

var path        = require('path');
var express     = require('express');
var router      = express.Router();
var compression = require('compression')();
var bodyParser  = require('body-parser');
var session     = require('cookie-session');
// var favicon     = require('serve-favicon');
var port        = process.env.PORT || 3000;

var serverRendering = require('./server-rendering');

router
  // .use(favicon(path.join(__dirname, '../dist/images/favicons/favicon.ico')))
  .use('/', express.static(path.join(__dirname, '../dist/images/favicons')))
  .use('/assets', express.static(path.join(__dirname, '../dist')))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(session({
    name: 'lab-website',
    keys: ['3sp1', '3densp34kermann', 'l4bwebs1te'],
    secure: process.env.NODE_ENV === 'production'
  }))
  .use(serverRendering);

express()
  .set('trust proxy', true)
  .use(compression)
  .use(router)
  .listen(port, function() {
    console.log('\nopen http://localhost:'+port+' in your browser');
  });
