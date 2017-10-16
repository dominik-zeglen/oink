var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['./src/public/ts/oink.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('ts-app', function () {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('style', function () {
  gulp.src('./src/public/css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/public/css/'));
});

gulp.task('style watcher', function () {
  gulp.run('style');
  gulp.watch('src/public/scss/*.scss', ['style']);
  gulp.watch('src/public/scss/components/*.scss', ['style']);
});

gulp.task('ts watcher', function () {
  gulp.run('ts-app');
  gulp.run('ts');
  gulp.watch('src/lib/*.ts', ['ts-app']);
  gulp.watch('src/lib/*/*.ts', ['ts-app']);
  gulp.watch('src/Oink.ts', ['ts-app']);
  gulp.watch('src/oink-manager.ts', ['ts-app']);
  gulp.watch('src/public/ts/*.ts', ['ts']);
  gulp.watch('src/public/ts/*/*.ts', ['ts']);
});