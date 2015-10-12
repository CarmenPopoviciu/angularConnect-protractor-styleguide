'use strict';

module.exports = function (grunt) {
    var serveStatic = require('serve-static');

    return {
        options: {
            port: 0,
            hostname: 'localhost'
        },
        server: {
            options: {
                open: true,
                livereload: true,
                port: 9005
            }
        }
    }
};
