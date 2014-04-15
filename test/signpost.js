/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('signpost', function () {
    var args, signpost;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        args = require('./mock/args');
        mockery.registerMock('./args', args);
        signpost = require('../lib/signpost');
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(signpost);
    });

    it('should have a `createRouter` method', function () {
        assert.isFunction(signpost.createRouter);
    });

    describe('.createRouter()', function () {

        it('should assert that the given routes are an object', function () {
            signpost.createRouter('foo');
            assert.isTrue(args.assertIsObject.withArgs('routes', 'foo').calledOnce);
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

        it('should have a `resolveUrl` method', function () {
            assert.isFunction(router.resolveUrl);
        });

        describe('.resolveUrl()', function () {

            it('should assert that the given url is a string', function () {
                router.resolveUrl('foo');
                assert.isTrue(args.assertIsString.withArgs('url', 'foo').calledOnce);
            });

            it('should not error when called with a valid URL', function () {
                assert.doesNotThrow(function () {
                    router.resolveUrl('foo');
                });
            });

            it('should return `false` when a matching route is not found', function () {
                router = signpost.createRouter({});
                assert.isFalse(router.resolveUrl('http://route1/'));
            });

            it('should resolve and return matches for basic routes', function () {
                router = signpost.createRouter({
                    'route1': 'target1',
                    'route2': 'target2'
                });
                assert.strictEqual(router.resolveUrl('http://route1/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://route1/foo'), 'http://target1/foo');
                assert.strictEqual(router.resolveUrl('http://route1/foo/bar'), 'http://target1/foo/bar');
                assert.strictEqual(router.resolveUrl('http://route2/'), 'http://target2/');
                assert.strictEqual(router.resolveUrl('http://route2/foo'), 'http://target2/foo');
                assert.strictEqual(router.resolveUrl('http://route2/foo/bar'), 'http://target2/foo/bar');
            });

            it('should resolve and return matches for routes with a path in the target', function () {
                router = signpost.createRouter({
                    'route1': 'target1/foo',
                    'route2': 'target2/foo/bar'
                });
                assert.strictEqual(router.resolveUrl('http://route1/'), 'http://target1/foo/');
                assert.strictEqual(router.resolveUrl('http://route1/bar'), 'http://target1/foo/bar');
                assert.strictEqual(router.resolveUrl('http://route2/'), 'http://target2/foo/bar/');
                assert.strictEqual(router.resolveUrl('http://route2/baz'), 'http://target2/foo/bar/baz');
            });

            it('should resolve and return matches for routes with a path in the route', function () {
                router = signpost.createRouter({
                    'route1/foo': 'target1',
                    'route1/bar': 'target1',
                    'route2/foo/bar': 'target2'
                });
                assert.strictEqual(router.resolveUrl('http://route1/foo/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://route1/foo/bar'), 'http://target1/bar');
                assert.strictEqual(router.resolveUrl('http://route1/bar/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://route1/bar/baz'), 'http://target1/baz');
                assert.strictEqual(router.resolveUrl('http://route2/foo/bar/'), 'http://target2/');
                assert.strictEqual(router.resolveUrl('http://route2/foo/bar/baz'), 'http://target2/baz');
            });

            it('should resolve and return matches for routes that are defined as objects', function () {
                router = signpost.createRouter({
                    'route': {
                        'foo': 'target1',
                        'bar': 'target2/baz/qux/',
                        '/': 'target3'
                    }
                });
                assert.strictEqual(router.resolveUrl('http://route/foo'), 'http://target3/foo');
                assert.strictEqual(router.resolveUrl('http://route/foo1'), 'http://target3/foo1');
                assert.strictEqual(router.resolveUrl('http://route/foo/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://route/foo/bar'), 'http://target1/bar');
                assert.strictEqual(router.resolveUrl('http://route/bar/'), 'http://target2/baz/qux/');
                assert.strictEqual(router.resolveUrl('http://route/bar/foo'), 'http://target2/baz/qux/foo');
            });

            it('should use the same protocol in the matched route', function () {
                router = signpost.createRouter({
                    'route1': 'target1'
                });
                assert.strictEqual(router.resolveUrl('http://route1/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('https://route1/'), 'https://target1/');
                assert.strictEqual(router.resolveUrl('ws://route1/'), 'ws://target1/');
            });

            it('should ignore protocols in routes and targets when matching', function () {
                router = signpost.createRouter({
                    'http://route1/': 'https://target1/',
                    'https://route2/': 'http://target2/'
                });
                assert.strictEqual(router.resolveUrl('ws://route1/'), 'ws://target1/');
                assert.strictEqual(router.resolveUrl('ws://route2/'), 'ws://target2/');
            });

            it('should ignore trailing slashes in routes and targets when matching', function () {
                router = signpost.createRouter({
                    'route1//': 'target1',
                    'route2': 'target2//'
                });
                assert.strictEqual(router.resolveUrl('http://route1/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://route2/'), 'http://target2/');
            });

            it('should resolve routes in definition order', function () {
                router = signpost.createRouter({
                    'route1': 'target1',
                    'route1/foo': 'target2',
                });
                assert.strictEqual(router.resolveUrl('http://route1/foo'), 'http://target1/foo');
            });

            it('should use the default route if no others match', function () {
                router = signpost.createRouter({
                    'route1': 'target1',
                    'route2': 'target2',
                    '**': 'target3',
                    'route4': 'target4'
                });
                assert.strictEqual(router.resolveUrl('http://route3/'), 'http://target3/');
                assert.strictEqual(router.resolveUrl('http://route4/'), 'http://target3/');
            });

            it('should support wildcards in the domain part of routes', function () {
                router = signpost.createRouter({
                    'route1': 'target1',
                    '*.route1': 'target2',
                    '*.route2/*': 'target3'
                });
                assert.strictEqual(router.resolveUrl('http://route1/'), 'http://target1/');
                assert.strictEqual(router.resolveUrl('http://foo.route1/'), 'http://target2/');
                assert.strictEqual(router.resolveUrl('http://foo.route1/bar'), 'http://target2/bar');
                assert.strictEqual(router.resolveUrl('http://foo.route2/*/'), 'http://target3/');
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

            it('should assert that the given request is a Request object', function () {
                router.resolveRequest(mockRequest);
                assert.isTrue(args.assertIsRequest.withArgs('request', mockRequest).calledOnce);
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