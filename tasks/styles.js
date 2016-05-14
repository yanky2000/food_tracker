'use strict';
var $ = require('gulp-load-plugins');

var gulp = require('gulp');
// var sourcemaps = require('gulp-sourcemaps');
// var sass = require('gulp-sass');
// var gulpIf = require('gulp-if');
// var newer = require('gulp-newer'); // process only new&modified files
// var autoprefixer = require('gulp-autoprefixer');
// var notify = require('gulp-notify');
var combiner = require('stream-combiner2').obj;
// var concat = require('gulp-concat');
// var debug = require('gulp-debug');
// var del = require('del');
// var prefixer = require('autoprefixer');
// var cached = require('cached'); // Returns only files with differed content(&names?) to it's cached ones. Usually use since:
// var remember = require('gulp-remember'); /* Returns cached files content not presented in input argument */
// var path = require('path');
// var browserSync = require('browser-sync').create();
// var multipipe = require('multipipe');
// var jade = require('gulp-jade');
// var rename = require('gulp-rename');
// var rev = require('gulp-rev'); // for long-term caching

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // to insert sourcemap only to development version. exclude in production

/* Process SASS files */

/* Apply to one sass file containing all premade @imports  */
gulp.task('styles', function () {
    
    return gulp.src('dev/assets/sass/**/*.sass', { since: gulp.lastRun('styles') })
        // .pipe(debug({title: 'src'}))
        /* apply if using concat for several files. Allows to process only new&modified files to concatenated file, adding unmodifed files to output file from its cache*/
        // .pipe(remember('styles')) //if using concat
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        // .pipe(debug({title: 'source-map'}))
        .pipe(sass({ indentedSyntax: true }))
        .on('error', notify.onError(function (err) {
            return {
                title: "Sass error caught!",
                message: err.message
            }
        })
        )
        .pipe(autoprefixer())
        // Don't use concat, because concat sass files beforehand with @import
        // .pipe(concat('all.css'))
        // .pipe(debug({title: 'sass'}))
        .pipe(gulpIf(isDevelopment, sourcemaps.write())) // If sourcemap.write{'.'} sourcefile will be created in separate file
        .pipe(gulp.dest('dist/assets/css'))
    // .pipe(debug({title: 'dest'}))
});

/* With error handling for all pipes */
// gulp.task('styles5', function () {
module.exports = function (options) {
    return function () {
        return combiner(
            gulp.src('dev/assets/sass/**/*.sass', { since: gulp.lastRun('styles5') }),
            // remember('styles5'),
            $.newer('dist/assets/css'),
            $.If(isDevelopment, $.sourcemaps.init()),
            $.sass({ indentedSyntax: true }),
            // autoprefixer(),
            $.If(isDevelopment, $.sourcemaps.write()),
            gulp.dest('dist/assets/css')
        ).on('error', $.notify.onError());
    };


};


/* Apply to separate css files */
// Should process only new&modified files, delete removed files, concat many files in one.
gulp.task('stylesConcat', function () {
    return gulp.src('dev/**/*.sass')
        .pipe(cached('stylesConcat')) // instead of adding {since: gulp.lastRun('stylesConcat')} to gulp.src, to prevent ctrl-z bug of deleted files.
        .pipe(remember('stylesConcat'))
        .pipe(sass({ indentedSyntax: true }))
        .on('error', notify.onError(function (err) {
            return {
                title: "Sass",
                message: err.message
            }
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist'))
})