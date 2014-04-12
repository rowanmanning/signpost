'use strict';

module.exports = {

    // Test routes
    routes: {
        'foo1.com': 'localhost:1000',
        'foo2.com': 'localhost:2000/bar',
        'foo3.com': {
            'bar': 'localhost:3001',
            '/baz': 'localhost:3002/a/b',
            '/': 'localhost:3000'
        },
        'foo4.com/bar': 'localhost:4000',
        'foo4.com/baz/': 'localhost:4000'
    },

    // Requests to test against routes
    requests: [

        // Undefined routes
        ['http://foo.com/', false],

        // Basic routes
        ['http://foo1.com/',    'http://localhost:1000/'],
        ['http://foo1.com/bar', 'http://localhost:1000/bar'],

        // No protocol switching
        ['https://foo1.com/', 'https://localhost:1000/'],
        ['ws://foo1.com/',    'ws://localhost:1000/'],

        // Routes with path in target
        ['http://foo2.com/',    'http://localhost:2000/bar/'],
        ['http://foo2.com/baz', 'http://localhost:2000/bar/baz'],

        // Routes with path in route
        ['http://foo3.com/bar',     'http://localhost:3000/bar'],
        ['http://foo3.com/bar1',    'http://localhost:3000/bar1'],
        ['http://foo3.com/bar/',    'http://localhost:3001/'],
        ['http://foo3.com/bar/baz', 'http://localhost:3001/baz'],
        ['http://foo3.com/baz/',    'http://localhost:3002/a/b/'],
        ['http://foo3.com/baz/qux', 'http://localhost:3002/a/b/qux'],

        // Routes with path in route (in top level)
        ['http://foo4.com/bar/',    'http://localhost:4000/'],
        ['http://foo4.com/bar/baz', 'http://localhost:4000/baz'],
        ['http://foo4.com/baz/',    'http://localhost:4000/'],
        ['http://foo4.com/baz/qux', 'http://localhost:4000/qux'],

    ]

};
