'use strict';

var args = require('./args');
var joinPath = require('path').join;

module.exports = {
    parse: parseRoutes
};

function parseRoutes (routes) {
    var parsedRoutes = [];
    args.assertIsObject('routes', routes);
    eachKey(routes, function (route, paths) {
        eachKey(parseRoutePaths(paths), function (path, target) {
            var routeText = joinPath(stripProtocol(route), path);
            var routeRegExp = constructRouteRegExp(routeText);
            parsedRoutes.push({
                text: routeText,
                regexp: routeRegExp,
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

function constructRouteRegExp (route) {
    var protocolRegExp = '^[a-z]+://';
    if (route === '**/') {
        return new RegExp(protocolRegExp + '.+');
    }
    var routeChunks = escapeRegExp(route).split('/');
    routeChunks[0] = parseHostPatterns(routeChunks[0]);
    return new RegExp(protocolRegExp + routeChunks.join('/'), 'i');
}

function parseHostPatterns (host) {
    host = host.replace(/\\\*/g, '[a-z0-9]+');
    return host;
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

