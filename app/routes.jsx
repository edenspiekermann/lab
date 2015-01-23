/* jshint
  -W079 : allows overriding Event variable for this file,
  -W098 : allows using React without using it (used after JSX compilation)
*/
"use strict";
var React = require('react');
var { Route, DefaultRoute, NotFoundRoute, Redirect } = require('react-router');

var Site = require('views/site');
var Index = require('views/index');
var Projects = require('views/projects');
var About = require('views/about');
var NotFound = require('views/not-found');

var routes = (
  <Route handler={Site}>

    <DefaultRoute handler={Index} />
    <Route name="projects" handler={Projects} />
    <Route name="about" handler={About} />

    <NotFoundRoute handler={NotFound} />

  </Route>
);

module.exports = routes;
