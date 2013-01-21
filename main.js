#! /usr/bin/env node

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,

    paths: {
        'underscore' : 'vendor/underscore',
        'moment'     : 'vendor/moment'
    },
});

requirejs(['lib/punch']);
