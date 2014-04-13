/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('args', function () {
    var args;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        args = require('../lib/args');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(args);
    });

    it('should have tests');

});