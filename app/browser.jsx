"use strict";
var React  = require('react');
var Router = require('react-router');
var merge = require('mout/object/merge');
var keys = require('when/keys');

var ApiClient = require('utils/api-client');
var routes = require('./routes');

function decode(input) {
  return JSON.parse(decodeURIComponent(input));
}

window.onload = () => {
  var { session, asyncData, translations } = window.amaphiko;
  session = decode(session);
  asyncData = decode(asyncData);
  translations = translations;

  Router.run(routes, Router.HistoryLocation, (Handler, state) => {

    var asyncDataRequests = (asyncData)
      ? Promise.resolve(asyncData)
      : state.routes
        .filter(route => {
          return route.handler.getAsyncData;
        }).reduce((asyncDataRequests, route) => {
          return merge(asyncDataRequests, route.handler.getAsyncData(ApiClient(session), state, session));
        }, {});

    asyncData = false;

    keys.all(asyncDataRequests)
      .then(asyncDataResponse => {
        React.render(React.createElement(Handler, {
          asyncData: asyncDataResponse,
          translations: translations,
          session: session
        }), document);
      })
      .catch(error => {
        if (error.redirect) {
          window.location.pathname = error.redirect;
        }
        if (error.message.slice(0,3) === '419') {
          window.location.pathname = '/logout';
        }
        if (process.env.NODE_ENV === 'development') {
          return window.console.error(error.stack);
        }
      });

  });
};
