'use strict';

var args = require('./args');
var joinPath = require('path').join;
var parseRoutes = require('./routes').parse;
var parseUrl = require('url').parse;

exports.createRouter = createRouter;

function createRouter (routes) {
    var router = {};
    routes = parseRoutes(routes);
    router.resolveUrl = resolveUrl.bind(null, router, routes);
    router.resolveRequest = resolveRequest.bind(null, router);
    router.resolve = resolve.bind(null, router);
    return router;
}

function resolveUrl (router, routes, url) {
    args.assertIsString('url', url);
    if (!hasProtocol(url)) {
        url = 'http://' + url;
    }
    var resolvedRoute;
    routes.forEach(function (route) {
        if (!resolvedRoute && route.regexp.test(url)) {
            resolvedRoute = route;
        }
    });
    if (!resolvedRoute) {
        return false;
    }
    return resolveTarget(url, resolvedRoute);
}

function resolveTarget (url, route) {
    url = parseUrl(url);
    var routeUrl = parseUrl('http://' + route.text.replace(/\*/g, 'x'));
    var protocol = url.protocol;
    if (protocol.indexOf('/') === -1) {
        protocol += '//';
    }
    var path = url.path.substr(routeUrl.path.length - 1);
    return protocol + joinPath(route.target, path);
}

function resolveRequest (router, request) {
    args.assertIsRequest('request', request);
    return router.resolveUrl(getRequestUrl(request));
}

function resolve (router, val) {
    if (typeof val === 'string') {
        return router.resolveUrl(val);
    }
    return router.resolveRequest(val);
}

function getRequestUrl (request) {
    var protocol = (request.connection.encrypted ? 'https' : 'http');
    var host = request.headers.host;
    var url = request.url;
    return protocol + '://' + host + url;
}

function hasProtocol (url) {
    return /^[a-z]+:\/\//.test(url);
}
