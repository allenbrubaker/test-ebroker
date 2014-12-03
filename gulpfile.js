var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver_update', plug.protractor.webdriver_update);

// Run protractor tests
gulp.task('test', ['webdriver_update'], function (cb) {
    var pro = plug.protractor;
    gulp.src([])
        .pipe(pro.protractor({
            configFile: 'protractor.conf.js',
        }))
        .on('error', function (e) {
            console.log(e);
            cb();
        });
});
