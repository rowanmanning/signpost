/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('routes', function () {
    var routes;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        routes = require('../lib/routes');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(routes);
    });

    it('should have tests');

});