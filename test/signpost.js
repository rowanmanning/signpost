/* jshint maxstatements: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

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
        var router, mockRouteData;

        beforeEach(function () {
            mockRouteData = require('./mock/route-data');
            router = signpost.createRouter(mockRouteData.routes);
        });

        it('should have a `resolveUrl` method', function () {
            assert.isFunction(router.resolveUrl);
        });

        describe('.resolveUrl()', function () {

            it('should error when called with an invalid URL', function () {
                assert.throws(function () {
                    router.resolveUrl(123);
                }, /invalid `url` argument/i, 'Non-string url');
                assert.throws(function () {
                    router.resolveUrl();
                }, /invalid `url` argument/i, 'Nonexistant url');
            });

            it('should not error when called with a valid URL', function () {
                assert.doesNotThrow(function () {
                    router.resolveUrl('foo');
                });
            });

            it('should return the expected resolved routes', function () {
                mockRouteData.requests.forEach(function (req) {
                    assert.strictEqual(router.resolveUrl(req[0]), req[1]);
                });
            });

        });

        it('should have a `resolveRequest` method', function () {
            assert.isFunction(router.resolveRequest);
        });

        describe('.resolveRequest()', function () {
            var mockRequest;

            beforeEach(function () {
                router.resolveUrl = sinon.stub();
                mockRequest = {
                    connection: {},
                    headers: {
                        host: 'example.com'
                    },
                    url: '/foo'
                };
            });

            it('should error when called with an invalid Request objcet', function () {
                assert.throws(function () {
                    router.resolveRequest({});
                }, /invalid `request` argument/i, 'Invalid request object');
                assert.throws(function () {
                    router.resolveRequest('foo');
                }, /invalid `request` argument/i, 'Non-object request');
                assert.throws(function () {
                    router.resolveRequest();
                }, /invalid `request` argument/i, 'Nonexistant request');
            });

            it('should not error when called with a valid Request object', function () {
                assert.doesNotThrow(function () {
                    router.resolveRequest({
                        connection: {},
                        headers: {},
                        url: ''
                    });
                });
            });

            it('should call `resolveUrl` with the correct request URL (http)', function () {
                router.resolveRequest(mockRequest);
                assert.isTrue(router.resolveUrl.withArgs('http://example.com/foo').calledOnce);
            });

            it('should call `resolveUrl` with the correct request URL (https)', function () {
                mockRequest.connection.encrypted = true;
                router.resolveRequest(mockRequest);
                assert.isTrue(router.resolveUrl.withArgs('https://example.com/foo').calledOnce);
            });

            it('should return the result of the `resolveUrl`', function () {
                router.resolveUrl.returns('foo');
                assert.strictEqual(router.resolveRequest(mockRequest), 'foo');
            });

        });

        it('should have a `resolve` method', function () {
            assert.isFunction(router.resolve);
        });

        describe('.resolve()', function () {

            beforeEach(function () {
                router.resolveUrl = sinon.stub();
                router.resolveRequest = sinon.stub();
            });

            it('should call `resolveUrl` when called with a string', function () {
                router.resolve('foo');
                assert.isTrue(router.resolveUrl.withArgs('foo').calledOnce);
            });

            it('should call `resolveRequest` when called with a non-string', function () {
                var request = {url: 'foo'};
                router.resolve(request);
                router.resolve(123);
                assert.isTrue(router.resolveRequest.withArgs(request).calledOnce);
                assert.isTrue(router.resolveRequest.withArgs(123).calledOnce);
            });

        });

    });

});