'use strict';

exports.createRouter = createRouter;

function createRouter (routes) {
    assertArgIsObject('routes', routes);
    var router = {
        routes: routes
    };
    router.resolve = resolveRoute.bind(null, router);
    return router;
}

function resolveRoute (router, request) {
    if (typeof request !== 'string') {
        assertArgIsRequest('request', request);
    }
}

function assertArgIsObject (name, val) {
    if (typeof val !== 'object') {
        throw new Error('Invalid `' + name + '` argument: should be an object');
    }
}

function assertArgIsRequest (name, val) {
    if (typeof val !== 'object' || typeof val.headers !== 'object' || typeof val.url !== 'string') {
        throw new Error('Invalid `' + name + '` argument: should be a ClientRequest object');
    }
}
