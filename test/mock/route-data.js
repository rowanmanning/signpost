'use strict';

module.exports = {

    // Test routes
    routes: {
        'foo1.com': 'localhost:1000',
        'foo2.com': 'localhost:2000/bar'
    },

    // Requests to test against routes
    requests: [
        ['http://foo1.com/',    'http://localhost:1000/'],
        ['http://foo1.com/bar', 'http://localhost:1000/bar'],
        ['http://foo2.com/',    'http://localhost:2000/bar/'],
        ['http://foo2.com/baz', 'http://localhost:2000/bar/baz']
    ]

};
