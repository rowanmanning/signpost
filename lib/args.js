'use strict';

var types = require('./types');

module.exports = {
    assertIsObject: assertArgumentIsObject,
    assertIsRequest: assertArgumentIsRequest,
    assertIsString: assertArgumentIsString
};

function assertArgumentIsObject (name, val) {
    if (!types.isPlainObject(val)) {
        throw new Error('Invalid `' + name + '` argument: should be an object');
    }
}

function assertArgumentIsRequest (name, val) {
    if (!types.isRequest(val)) {
        throw new Error('Invalid `' + name + '` argument: should be a Request object');
    }
}

function assertArgumentIsString (name, val) {
    if (typeof val !== 'string') {
        throw new Error('Invalid `' + name + '` argument: should be a string');
    }
}
