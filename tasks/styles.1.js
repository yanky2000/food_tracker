'use strict';
var $ = require('gulp-load-plugins')();

var gulp = require('gulp');
var combiner = require('stream-combiner2').obj;

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // to insert sourcemap only to 

module.exports = function (options) {

    return function () {
        return combiner(
            // gulp.src(options.src, { since: gulp.lastRun('styles5') }),
            gulp.src(options.src),
            // remember('styles5'),
            // $.newer('dist/assets/css'),
            $.if(isDevelopment, $.sourcemaps.init()),
            $.sass({ indentedSyntax: true }),
            // autoprefixer(),
            $.if(isDevelopment, $.sourcemaps.write()),
            gulp.dest('dist/assets/css')
        ).on('error', $.notify.onError());
    };
    
};

