'use strict';

var joinPath = require('path').join;

module.exports = {
    parse: parseRoutes
};

function parseRoutes (routes) {
    var parsedRoutes = [];
    eachKey(routes, function (route, paths) {
        eachKey(parseRoutePaths(paths), function (path, target) {
            var routeWithPath = joinPath(stripProtocol(route), path);
            var routeRegExp = '^(https?|ws)://' + parseRoutePatterns(escapeRegExp(routeWithPath));
            parsedRoutes.push({
                text: routeWithPath,
                regexp: new RegExp(routeRegExp, 'i'),
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

function parseRoutePatterns (route) {
    route = route.replace(/^\/*\\\*\\\*\/*$/, '.+');
    route = route.replace(/^[a-z0-9\.-]*\\\*[a-z0-9\.-]*/g, '[a-z0-9]+');
    return route;
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

