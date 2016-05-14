'use strict';
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
// var concat = require('gulp-concat');
var debug = require('gulp-debug');
var gulpIf = require('gulp-if');
var newer = require('gulp-newer'); // process only new&modified files
var del = require('del');
// var prefixer = require('autoprefixer');
var autoprefixer = require('gulp-autoprefixer');
// var cached = require('cached'); // Returns only files with differed content(&names?) to it's cached ones. Usually use since:
// var remember = require('gulp-remember'); /* Returns cached files content not presented in input argument */
var path = require('path');
var browserSync = require('browser-sync').create();
var notify = require('gulp-notify');
var combiner = require('stream-combiner2').obj;
var newer = require('gulp-newer');
// var multipipe = require('multipipe');
var jade = require('gulp-jade');
// var rename = require('gulp-rename');
// var rev = require('gulp-rev'); // for long-term caching

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // to insert sourcemap only to development version. exclude in production


var cssDevPath = 'dev/assets/sass/**/*.sass';
var jsPath = 'dev/assets/js/';
var imgPath = 'dev/assets/img/';
var assetsPath = 'dev/assets/';
var allPath = '/**/*.*';
var cssDistPath = 'dist/assets/css';


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // to insert sourcemap only to development version. exclude in production

/* Process SASS files */

/* With error handling for all pipes */
gulp.task('styles', function () {
// module.exports = function (options) {
    // return function () {
        return combiner(
            gulp.src(cssDevPath, { since: gulp.lastRun('styles') }),
            // remember('styles'),
            newer(cssDistPath),
            gulpIf(isDevelopment, sourcemaps.init()),
            sass({ indentedSyntax: true }),
            debug({title: 'sass'}),
            autoprefixer(),
            gulpIf(isDevelopment, sourcemaps.write()),
            gulp.dest(cssDistPath)
        ).on('error', notify.onError());
    // };


});


/* Apply to separate css files */
// Should process only new&modified files, delete removed files, concat many files in one.
gulp.task('stylesConcat', function () {
    return gulp.src(cssDevPath)
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


/* ========== JADE ==============*/
gulp.task('jade', function () {
    var YOUR_LOCALS = {};

    return combiner(
        gulp.src('dev/**/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('dist'))
            .pipe(gulp.dest('dev'))
    ).on('error', notify.onError());
});

/* ========= WATCHERS ==========*/
gulp.task('styles:watchDeleted', function () {
    gulp.watch('dev/styles/**/*.*', gulp.series('stylesConcat')).on('unlink', function (filepath) {
        /* make 'remember' and 'cache' remove files, that have been deleted  from dev folder. As a result, if we delete some sass/css files from dev their content won't added to output files from Modules cache */
        remember.forget('stylesConcat', path.resolve(filepath));
        delete cached.caches.stylesConcat[path.resolve(filepath)];
    })
});


/* kn up dist directory */
gulp.task('clean', function () {
    return del('dist');
});


/* Copy all assets to dist */
gulp.task('assets', function () {
    // console.log(gulp.lastRun('assets'));

    // return with gulp.src('assets/**/*.{js,css}') - {js,css} all files with these extensions 
    // operates only for files, changed since last run of 'html' task
    return gulp.src('dev/**/*.*', { since: gulp.lastRun('assets') }) // starts filtering after assets run for 2nd time
        .pipe(newer('dist')) //process only new&changed files compared to already existing ones, but doesn't respond to files deletion.
        .pipe(debug({ title: 'assets' }))
        .pipe(gulp.dest('dist'));
});


/* Makes first build of dist */
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('assets', 'jade', 'styles')
));


/* Watch for changes in styles and assets */
gulp.task('watch', function () {
    gulp.watch(cssDevPath, gulp.series('styles'));
    gulp.watch('dev/**/*.jade', gulp.series('jade'));
    gulp.watch('dev/**/*.*', gulp.series('assets'));
});

/* ========== Browser Sync ==========*/
gulp.task('serve', function () {
    browserSync.init({
        server: 'dist'
    });

    browserSync.watch('dist/**/*.*').on('change', browserSync.reload)
});

/* Init dist version */
gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);




/* ========== MISC =========== */

// Choose different dest based on file extension
gulp.task('ext', function () {
    return gulp.src('dev/**/*.*')
        .on('data', function (file) {
            console.log({
                extname: file.extname
            });
        })
        .pipe(gulp.dest(function (file) {
            return file.extname == '.js' ? 'js' : 'other';
        }))
});


/* ======= USE IT TO SEPARATE TASKS ==========*/
// function lazyRequireTask(taskName, path, options) {
//     options = options || {};
//     options.taskName = taskName;
//     gulp.task(taskName, function (callback) {
        // var task = require(path).call(this, options);

//         return task(callback);
//     });
// }


// lazyRequireTask('styles', './tasks/styles.1.js', {
//     src: 'dev/assets/sass/**/*.sass'
// });