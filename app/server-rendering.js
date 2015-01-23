/* jshint node: true */
"use strict";
var React  = require('react');
var Router = require('react-router');
var merge  = require('mout/object/merge');
var keys   = require('when/keys');

var ApiClient = require('utils/api-client');
var routes = require('./routes');

module.exports = function renderApp(request, response) {

  var router = Router.create({
    routes: routes,
    onAbort: onAbort,
    location: request.url
  });

  router.run(function(Handler, state) {

    var asyncData = state.routes
      .filter(function(route) { return typeof route.handler.getAsyncData === 'function';})
      .reduce(function(asyncDataRequests, route) {
        return merge(asyncDataRequests, route.handler.getAsyncData(ApiClient(request.session), state, request.session));
      }, {});

    keys.all(asyncData)
      .then(function(asyncData) {
        var markup = React.renderToString(React.createElement(Handler, {
          asyncData: asyncData,
          translations: request.translations,
          session: request.session
        }));
        response.type('text/html');
        response.end('<!DOCTYPE html>' + markup);
      })
      .catch(function(error) {
        if (error.redirect) {
          response.redirect(error.redirect);
        }
        if (error.message.slice(0,3) === '419') {
          response.redirect('/logout');
        }
        console.log(error.stack);
        if (process.env.NODE_ENV === 'development') {
          return response.end(error.stack);
        }
        response.redirect('/404?error=true');
      });
  });

  function onAbort(abortReason, location) {
    if (abortReason.constructor.name === 'Redirect') {
      return response.redirect(this.makePath(abortReason.to, abortReason.params, abortReason.query));
    }
    console.log(abortReason, location);
    response.redirect('/404?error=true');
  }
};
