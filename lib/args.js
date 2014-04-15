'use strict';

var types = require('./types');

module.exports = {
    assertIsObject: createArgumentAsserter(types.isPlainObject, 'should be an object'),
    assertIsRequest: createArgumentAsserter(types.isRequest, 'should be a Request object'),
    assertIsString: createArgumentAsserter(types.isString, 'should be a string')
};

function createArgumentAsserter (validator, errorMessage) {
    return function (name, val) {
        if (!validator(val)) {
            throw new Error('Invalid `' + name + '` argument: ' + errorMessage);
        }
    };
}
