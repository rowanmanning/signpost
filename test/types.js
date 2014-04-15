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
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(types);
    });

    it('should have an `isPlainObject` method', function () {
        assert.isFunction(types.isPlainObject);
    });

    describe('.isPlainObject()', function () {

        it('should return `true` when called with an object', function () {
            assert.isTrue(types.isPlainObject({}));
        });

        it('should return `false` when called with an array', function () {
            assert.isFalse(types.isPlainObject([]));
        });

        it('should return `false` when called with `null`', function () {
            assert.isFalse(types.isPlainObject(null));
        });

        it('should return `false` when called with any other types', function () {
            assert.isFalse(types.isPlainObject('foo'));
            assert.isFalse(types.isPlainObject(123));
            assert.isFalse(types.isPlainObject(true));
        });

    });

    it('should have an `isRequest` method', function () {
        assert.isFunction(types.isPlainObject);
    });

    describe('.isRequest()', function () {

        it('should return `true` when called with a valid Request object', function () {
            assert.isTrue(types.isRequest({
                connection: {},
                headers: {
                    host: 'example.com'
                },
                url: '/foo'
            }));
        });

        it('should return `false` when called with an invalid Request object', function () {
            assert.isFalse(types.isRequest({}));
            assert.isFalse(types.isRequest({
                headers: {
                    host: 'example.com'
                },
                url: '/foo'
            }));
            assert.isFalse(types.isRequest({
                connection: {},
                url: '/foo'
            }));
            assert.isFalse(types.isRequest({
                connection: {},
                headers: {
                    host: 'example.com'
                }
            }));
        });

        it('should return `false` when called with any other types', function () {
            assert.isFalse(types.isRequest([]));
            assert.isFalse(types.isRequest(null));
            assert.isFalse(types.isRequest('foo'));
            assert.isFalse(types.isRequest(123));
            assert.isFalse(types.isRequest(true));
        });

    });

    it('should have an `isString` method', function () {
        assert.isFunction(types.isPlainObject);
    });

    describe('.isString()', function () {

        it('should return `true` when called with a string', function () {
            assert.isTrue(types.isString('foo'));
        });

        it('should return `false` when called with any other types', function () {
            assert.isFalse(types.isString({}));
            assert.isFalse(types.isString([]));
            assert.isFalse(types.isString(123));
            assert.isFalse(types.isString(true));
        });

    });

});