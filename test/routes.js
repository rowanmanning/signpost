/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('routes', function () {
    var args, routes;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        args = require('./mock/args');
        mockery.registerMock('./args', args);
        routes = require('../lib/routes');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be an object', function () {
        assert.isObject(routes);
    });

    it('should have a `parse` method', function () {
        assert.isFunction(routes.parse);
    });

    describe('.parse()', function () {

        it('should assert that the given routes are an object', function () {
            routes.parse('foo');
            assert.isTrue(args.assertIsObject.withArgs('routes', 'foo').calledOnce);
        });

        it('should return an array', function () {
            assert.isArray(routes.parse({}));
        });

        describe('returned array', function () {

            it('should contain the expected right number of routes', function () {
                var routeArray = routes.parse({
                    'route1': 'target1',
                    'route2': 'target2',
                    'route3': {
                        'foo': 'target3.1',
                        'bar': 'target3.2'
                    }
                });
                assert.lengthEquals(routeArray, 4);
            });

            describe('each route', function () {

                it('should have `text`, `regexp`, and `target` properties', function () {
                    var routeArray = routes.parse({
                        'route1': 'target1',
                        'route2': 'target2'
                    });
                    routeArray.forEach(function (route) {
                        assert.isObject(route);
                        assert.isString(route.text);
                        assert.isInstanceOf(route.regexp, RegExp);
                        assert.isString(route.target);
                    });
                });

                describe('.text', function () {

                    it('should have a trailing slash', function () {
                        var routeArray = routes.parse({
                            'route1': 'target1'
                        });
                        assert.strictEqual(routeArray[0].text, 'route1/');
                    });

                    it('should be the route host/path joined together', function () {
                        var routeArray = routes.parse({
                            'route1/foo/': 'target1',
                            'route2/bar': 'target2',
                            'route3': {
                                'baz': 'target3',
                                'qux': 'target4'
                            }
                        });
                        assert.strictEqual(routeArray[0].text, 'route1/foo/');
                        assert.strictEqual(routeArray[1].text, 'route2/bar/');
                        assert.strictEqual(routeArray[2].text, 'route3/baz/');
                        assert.strictEqual(routeArray[3].text, 'route3/qux/');
                    });

                    it('should have protocols stripped', function () {
                        var routeArray = routes.parse({
                            'http://route1': 'target1',
                            'https://route2': 'target2',
                            'ws://route3': 'target3'
                        });
                        assert.strictEqual(routeArray[0].text, 'route1/');
                        assert.strictEqual(routeArray[1].text, 'route2/');
                        assert.strictEqual(routeArray[2].text, 'route3/');
                    });

                });

                describe('.regexp', function () {

                    it('should be based on the route', function () {
                        var routeArray = routes.parse({
                            'route1': 'target1',
                            'route2/foo': 'target2',
                            'route3/bar/baz': 'target3'
                        });
                        assert.strictEqual(routeArray[0].regexp.source, '^[a-z]+://route1/');
                        assert.strictEqual(routeArray[1].regexp.source, '^[a-z]+://route2/foo/');
                        assert.strictEqual(routeArray[2].regexp.source, '^[a-z]+://route3/bar/baz/');
                    });

                    it('should have regular expression characters escaped', function () {
                        var routeArray = routes.parse({
                            'route-1.com/foo^/{bar}/(baz|qux)?/[$+]*': 'target1'
                        });
                        assert.strictEqual(
                            routeArray[0].regexp.source,
                            '^[a-z]+://route\\-1\\.com/foo\\^/\\{bar\\}/\\(baz\\|qux\\)\\?/\\[\\$\\+\\]\\*/'
                        );
                    });

                    it('should expand the default route pattern (**) to match any URL', function () {
                        var routeArray = routes.parse({
                            '**': 'target1'
                        });
                        assert.strictEqual(routeArray[0].regexp.source, '^[a-z]+://.+');
                    });

                    it('should expand wildcards in the host part of the route', function () {
                        var routeArray = routes.parse({
                            '*.route1': 'target1',
                            '*.*.route2': 'target2',
                            'route3.*': 'target3',
                            'route4.*/foo/*': 'target4'
                        });
                        assert.strictEqual(routeArray[0].regexp.source, '^[a-z]+://[a-z0-9]+\\.route1/');
                        assert.strictEqual(routeArray[1].regexp.source, '^[a-z]+://[a-z0-9]+\\.[a-z0-9]+\\.route2/');
                        assert.strictEqual(routeArray[2].regexp.source, '^[a-z]+://route3\\.[a-z0-9]+/');
                        assert.strictEqual(routeArray[3].regexp.source, '^[a-z]+://route4\\.[a-z0-9]+/foo/\\*/');
                    });

                });

                describe('.target', function () {

                    it('should have protocols stripped', function () {
                        var routeArray = routes.parse({
                            'route1': 'http://target1',
                            'route2': 'https://target2',
                            'route3': 'ws://target3'
                        });
                        assert.strictEqual(routeArray[0].target, 'target1');
                        assert.strictEqual(routeArray[1].target, 'target2');
                        assert.strictEqual(routeArray[2].target, 'target3');
                    });

                });

            });

        });

    });

});