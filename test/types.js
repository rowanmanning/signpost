/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('types', function () {
    var types;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        types = require('../lib/types');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(types);
    });

    it('should have tests');

});