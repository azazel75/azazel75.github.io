// -*- coding: utf-8 -*-
define(['url/querystring/decode', 'url/querystring/encode'], function(decode, encode) {
    'use strict';
    var exports = {};
    exports.decode = exports.parse = decode;
    exports.encode = exports.stringify = encode;
    return exports;
});
