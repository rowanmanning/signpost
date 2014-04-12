/* jshint maxstatements: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
//var sinon = require('sinon');

describe('signpost', function () {
    var signpost;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        signpost = require('../lib/signpost');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(signpost);
    });

    it('should have a `createRouter` method', function () {
        assert.isFunction(signpost.createRouter);
    });

    describe('.createRouter()', function () {

        it('should error when called with an invalid set of routes', function () {
            assert.throws(function () {
                signpost.createRouter('foo');
            }, /invalid `routes` argument/i, 'Non-object routes');
            assert.throws(function () {
                signpost.createRouter();
            }, /invalid `routes` argument/i, 'Nonexistant routes');
        });

        it('should not error when called with a valid set of routes', function () {
            assert.doesNotThrow(function () {
                signpost.createRouter({});
            });
        });

        it('should return an object (router)', function () {
            assert.isObject(signpost.createRouter({}));
        });

    });

    describe('router', function () {
        var router;

        beforeEach(function () {
            router = signpost.createRouter({});
        });

        it('should have a `resolve` method', function () {
            assert.isFunction(router.resolve);
        });

        describe('.resolve()', function () {

            it('should error when called with an invalid request', function () {
                assert.throws(function () {
                    router.resolve({});
                }, /invalid `request` argument/i, 'Invalid request object');
                assert.throws(function () {
                    router.resolve(123);
                }, /invalid `request` argument/i, 'Non-object/string request');
                assert.throws(function () {
                    router.resolve();
                }, /invalid `request` argument/i, 'Nonexistant request');
            });

            it('should not error when called with a valid Request object', function () {
                assert.doesNotThrow(function () {
                    router.resolve({
                        headers: {},
                        url: ''
                    });
                });
            });

            it('should not error when called with a valid request string', function () {
                assert.doesNotThrow(function () {
                    router.resolve('foo');
                });
            });

            it('should resolve routes correctly when called with request strings');

            it('should resolve routes correctly when called with Request objects');

        });

    });

});