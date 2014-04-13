'use strict';

module.exports = {
    isPlainObject: isPlainObject,
    isRequest: isRequest
};

function isPlainObject (obj) {
    return (obj !== null && typeof obj === 'object');
}

function isRequest (req) {
    if (typeof req !== 'object') {
        return false;
    }
    if (typeof req.connection !== 'object') {
        return false;
    }
    if (typeof req.headers !== 'object') {
        return false;
    }
    if (typeof req.url !== 'string') {
        return false;
    }
    return true;
}

