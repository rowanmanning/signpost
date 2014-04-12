'use strict';

var parseUrl = require('url').parse;

exports.createRouter = createRouter;

function createRouter (routes) {
    assertArgIsObject('routes', routes);
    var router = {};
    router.resolveUrl = resolveUrl.bind(null, router, routes);
    router.resolveRequest = resolveRequest.bind(null, router, routes);
    router.resolve = resolve.bind(null, router);
    return router;
}

function resolveUrl (router, routes, url) {
    assertArgIsString('url', url);
    url = parseUrl(url);
    if (routes[url.host]) {
        return 'http://' + routes[url.host] + url.path;
    }
}

function resolveRequest (router, routes, request) {
    assertArgIsRequest('request', request);
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

function assertArgIsObject (name, val) {
    if (typeof val !== 'object') {
        throw new Error('Invalid `' + name + '` argument: should be an object');
    }
}

function assertArgIsString (name, val) {
    if (typeof val !== 'string') {
        throw new Error('Invalid `' + name + '` argument: should be a string');
    }
}

function assertArgIsRequest (name, val) {
    if (!isRequest(val)) {
        throw new Error('Invalid `' + name + '` argument: should be a ClientRequest object');
    }
}

function isRequest (req) {
    if (typeof req !== 'object') {
        return false;
    }
    if (typeof req.connection !== 'object') {
        return false;
    }
    if (typeof req.headers !== 'object') {
        return false;
    }
    if (typeof req.url !== 'string') {
        return false;
    }
    return true;
}
