
Signpost
========

Resolve an incoming request against a routing table.

**Current Version:** *0.0.0*  
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



[mit]: http://opensource.org/licenses/mit-license.php
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/rowanmanning/signpost
[travis-img]: https://travis-ci.org/rowanmanning/signpost.svg?branch=master
