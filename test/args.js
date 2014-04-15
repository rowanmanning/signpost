/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('args', function () {
    var args, types;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        types = require('./mock/types');
        mockery.registerMock('./types', types);
        args = require('../lib/args');
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(args);
    });

    it('should have an `assertIsObject` method', function () {
        assert.isFunction(args.assertIsObject);
    });

    describe('.assertIsObject()', function () {

        it('should use `types.isPlainObject()` to check validity', function () {
            types.isPlainObject.returns(true);
            args.assertIsObject('foo', 'bar');
            assert.isTrue(types.isPlainObject.withArgs('bar').calledOnce);
        });

        it('should not throw an error if `types.isPlainObject()` returns `true`', function () {
            types.isPlainObject.returns(true);
            assert.doesNotThrow(function () {
                args.assertIsObject('foo', 'bar');
            });
        });

        it('should throw an error if `types.isPlainObject()` returns `false`', function () {
            types.isPlainObject.returns(false);
            assert.throws(function () {
                args.assertIsObject('foo', 'bar');
            }, 'Invalid `foo` argument: should be an object');
        });

    });

    it('should have an `assertIsRequest` method', function () {
        assert.isFunction(args.assertIsRequest);
    });

    describe('.assertIsRequest()', function () {

        it('should use `types.isRequest()` to check validity', function () {
            types.isRequest.returns(true);
            args.assertIsRequest('foo', 'bar');
            assert.isTrue(types.isRequest.withArgs('bar').calledOnce);
        });

        it('should not throw an error if `types.isRequest()` returns `true`', function () {
            types.isRequest.returns(true);
            assert.doesNotThrow(function () {
                args.assertIsRequest('foo', 'bar');
            });
        });

        it('should throw an error if `types.isRequest()` returns `false`', function () {
            types.isRequest.returns(false);
            assert.throws(function () {
                args.assertIsRequest('foo', 'bar');
            }, 'Invalid `foo` argument: should be a Request object');
        });

    });

    it('should have an `assertIsString` method', function () {
        assert.isFunction(args.assertIsString);
    });

    describe('.assertIsString()', function () {

        it('should use `types.isString()` to check validity', function () {
            types.isString.returns(true);
            args.assertIsString('foo', 'bar');
            assert.isTrue(types.isString.withArgs('bar').calledOnce);
        });

        it('should not throw an error if `types.isString()` returns `true`', function () {
            types.isString.returns(true);
            assert.doesNotThrow(function () {
                args.assertIsString('foo', 'bar');
            });
        });

        it('should throw an error if `types.isString()` returns `false`', function () {
            types.isString.returns(false);
            assert.throws(function () {
                args.assertIsString('foo', 'bar');
            }, 'Invalid `foo` argument: should be a string');
        });

    });

});