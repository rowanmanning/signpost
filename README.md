
Signpost
========

Resolve an incoming request against a routing table.

**Current Version:** *0.1.0*  
**Node Support:** *0.10.x, 0.11.x*  
**License:** [MIT][mit]  
**Build Status:** [![Build Status][travis-img]][travis]

```js
var router = signpost.createRouter({
    'example.com': 'localhost:3000',
    'api.example.com': {
        'v1': 'localhost:4000',
        'v2': 'localhost:5000'
    }
});

router.resolve('http://example.com/');            // http://localhost:3000/
router.resolve('http://example.com/about');       // http://localhost:3000/about
router.resolve('https://api.example.com/v1/foo'); // https://localhost:4000/foo
router.resolve('https://api.example.com/v2/foo'); // https://localhost:5000/foo
```


Install
-------

Install Signpost with [npm][npm]:

```sh
npm install signpost
```


Usage
-----

Require Signpost like any other node module:

```js
var signpost = require('signpost');
```


### Creating a router

Create a router which can be used to resolve URLs/requests later:

```js
var router = signpost.createRouter({
    'example.com': 'localhost:3000'
});
```


### Resolving URLs

Now that we have a router, we can resolve URLs and work out where to send them:

```js
router.resolve('http://example.com/foo'); // http://localhost:3000/foo
```


### Resolving Requests

Signpost can also resolve request objects, which is useful if you're using [Connect][connect] or a similar web framework:

```js
var app = connect().use(function (request, response) {
    var destination = router.resolve(request);
    // do something with `destination`
});
```


### Domain Routes

The most basic usage of Signpost is to map different host names to different applications/ports on your server, almost like virtual-hosts in Apache:

```js
signpost.createRouter({
    'example.com': 'localhost:3000',
    'api.example.com': 'localhost:4000',
    'another-host.com': 'localhost:5000'
});

router.resolve('http://example.com/');      // http://localhost:3000/
router.resolve('https://api.example.com/'); // https://localhost:4000/
```

There's no need to include a protocol in the routes or targets, as the protocol will always remain the same as the resolved URL/request.


### Route Paths

Routes may include a path, which will restrict matching to URLs/requests which start with the given path. The part of the path which is in the router will be stripped from the resolved URL:

```js
signpost.createRouter({
    'example.com/foo': 'localhost:3000',
    'example.com/bar': 'localhost:4000'
});

router.resolve('http://example.com/foo/abc'); // http://localhost:3000/abc
router.resolve('http://example.com/bar/123'); // http://localhost:4000/123
```

Routes can also be defined as objects, which reduces repetition and makes it easier to see related routes:

```js
signpost.createRouter({
    'example.com': {
        'foo': 'localhost:3000',
        'bar': 'localhost:4000',
        '/': 'localhost:5000'
    }
});
```


### Target Paths

Targets may also define a path, which allows you to route multiple hosts to different paths on the same application:

```js
signpost.createRouter({
    'foo.example.com': 'localhost/foo',
    'bar.example.com': 'localhost/bar'
});

router.resolve('http://foo.example.com/'); // http://localhost/foo
router.resolve('http://bar.example.com/'); // http://localhost/bar
```


### Default Routes

If no routes match the given URL/request, then a default route can handle these. The default route is denoted with `**`, and must be the last route defined:

```js
signpost.createRouter({
    'example.com': 'localhost:3000',
    '**': 'localhost:4000'
});

router.resolve('http://another-host.com/'); // http://localhost:4000/
```


### Wildcards

You can use wildcards in the domain part of a route, which allows you to resolve requests without defining a route for every possible subdomain:

```js
signpost.createRouter({
    '*.example.com': 'localhost:3000'
});

router.resolve('http://foo.example.com/'); // http://localhost:3000/
router.resolve('http://bar.example.com/'); // http://localhost:3000/
```

Wildcards only work in the domain part of the route, not the path.


### Ordering

The ordering of the routes you define is meaningful, and routes are checked in definition order. As soon as a route matches the given URL/request, no more routes will be checked against:

```js
signpost.createRouter({
    'example.com': 'localhost:3000',
    'example.com': 'localhost:4000'
});

router.resolve('http://example.com/'); // http://localhost:3000/
```


Contributing
------------

To contribute to Signpost, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make lint test
```


License
-------

Signpost is licensed under the [MIT][mit] license.  
Copyright &copy; 2014, Rowan Manning



[connect]: http://www.senchalabs.org/connect/
[mit]: http://opensource.org/licenses/mit-license.php
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/rowanmanning/signpost
[travis-img]: https://travis-ci.org/rowanmanning/signpost.svg?branch=master
