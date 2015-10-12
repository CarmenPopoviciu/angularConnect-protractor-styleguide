'use strict';

module.exports = function (grunt) {

    require('load-grunt-config')(grunt);

    grunt.registerTask('server', 'Start up a web server to serve the presentation', [
        'connect:server',
        'watch'
    ]);
};