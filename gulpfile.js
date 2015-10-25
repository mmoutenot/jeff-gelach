var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    stylus      = require('gulp-stylus'),
    inline      = require('rework-inline'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    coffee      = require('gulp-coffee'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    server      = tinylr(),
    es          = require('event-stream'),
    nib         = require('nib');


// --- Basic Tasks ---
gulp.task('css', function() {
  return gulp.src('src/assets/stylesheets/*.styl')
    .pipe(stylus({ use: nib() }))
    .pipe( gulp.dest('dist/assets/stylesheets/') )
    .pipe( livereload( server ));
});

gulp.task('js', function() {
  return es.merge(
        gulp.src('src/assets/scripts/*.coffee').
          pipe(coffee()),
        gulp.src('src/assets/scripts/*.js')).
    pipe( uglify() ).
    pipe( concat('all.min.js')).
    pipe( gulp.dest('dist/assets/scripts/')).
    pipe( livereload( server ));
});

gulp.task('templates', function() {
  return gulp.src('src/*.jade').
    pipe(jade({
      pretty: true
    })).
    pipe(gulp.dest('dist/')).
    pipe( livereload( server ));
});

gulp.task('images', function() {
  return gulp.src('src/assets/images/*')
    .pipe(gulp.dest('dist/assets/images/'))
    .pipe( livereload( server ));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/assets/stylesheets/*.styl',['css']);

    gulp.watch('src/assets/scripts/*.js',['js']);

    gulp.watch('src/assets/scripts/*.coffee',['js']);

    gulp.watch('src/*.jade',['templates']);

    gulp.watch('src/assets/images/*',['images']);

  });
});

// Default Task
gulp.task('default', ['js','css','images','templates','express','watch']);
