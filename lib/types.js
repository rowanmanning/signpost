'use strict';

module.exports = {
    isPlainObject: isPlainObject,
    isRequest: isRequest,
    isString: isString
};

function isPlainObject (obj) {
    return (obj !== null && typeof obj === 'object' && Array.isArray(obj) === false);
}

function isRequest (req) {
    if (!isPlainObject(req)) {
        return false;
    }
    if (!isPlainObject(req.connection)) {
        return false;
    }
    if (!isPlainObject(req.headers)) {
        return false;
    }
    if (typeof req.url !== 'string') {
        return false;
    }
    return true;
}

function isString (str) {
    return (typeof str === 'string');
}
