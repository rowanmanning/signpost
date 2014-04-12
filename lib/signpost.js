'use strict';

var joinPath = require('path').join;
var parseUrl = require('url').parse;

exports.createRouter = createRouter;

function createRouter (routes) {
    assertArgIsObject('routes', routes);
    var router = {};
    routes = parseRoutes(routes);
    router.resolveUrl = resolveUrl.bind(null, router, routes);
    router.resolveRequest = resolveRequest.bind(null, router);
    router.resolve = resolve.bind(null, router);
    return router;
}

function parseRoutes (routes) {
    var parsedRoutes = [];
    eachKey(routes, function (route, paths) {
        eachKey(parseRoutePaths(paths), function (path, target) {
            var routeWithPath = joinPath(stripProtocol(route), path);
            parsedRoutes.push({
                text: routeWithPath,
                regexp: new RegExp('^(https?|ws)://' + escapeRegExp(routeWithPath), 'i'),
                target: stripProtocol(target)
            });
        });
    });
    return parsedRoutes;
}

function parseRoutePaths (paths) {
    if (typeof paths === 'string') {
        return {
            '/': paths
        };
    }
    var newPaths = {};
    eachKey(paths, function (path, target) {
        newPaths[normalizeRoutePath(path)] = target;
    });
    return newPaths;
}

function normalizeRoutePath (path) {
    if (path.indexOf('/') !== 0) {
        path = '/' + path;
    }
    if (!/\/$/.test(path)) {
        path += '/';
    }
    return path;
}

function resolveUrl (router, routes, url) {
    assertArgIsString('url', url);
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
    var routeUrl = parseUrl('http://' + route.text);
    var protocol = url.protocol;
    if (protocol.indexOf('/') === -1) {
        protocol += '//';
    }
    var path = url.path.substr(routeUrl.path.length - 1);
    return protocol + joinPath(route.target, path);
}

function resolveRequest (router, request) {
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

function eachKey (obj, fn) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            fn(key, obj[key], obj);
        }
    }
}

function escapeRegExp (str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

function stripProtocol (url) {
    return url.replace(/^[a-z]+:\/\//i, '');
}
