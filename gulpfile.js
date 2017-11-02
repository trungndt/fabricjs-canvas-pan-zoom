var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass', function () {
    return gulp.src(['assets/scss/*.scss'])
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .on('error', onError)
        .pipe(gulp.dest('assets/css'))
});
gulp.task('watch', function () {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    // Other watchers
});

gulp.task('default', function () {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    // Other watchers
});
function onError(err) {
    console.log(err);
    this.emit('end');
}