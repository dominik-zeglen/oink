var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('js', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['./src/public/js/oink.js'],
  })
    .transform('babelify', {presets: ['env', 'react']})
    .bundle()
    .pipe(fs.createWriteStream('./dist/public/js/oink.js'));
});

gulp.task('ts-app', function () {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('style', function () {
  gulp.src('./src/public/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({sourceMap: true}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/public/css/'));
});

gulp.task('style-start', function () {
  gulp.run('style');
  gulp.watch('src/public/scss/*.scss', ['style']);
  gulp.watch('src/public/scss/components/*.scss', ['style']);
});

gulp.task('ts-start', function () {
  gulp.run('ts-app');
  gulp.watch('src/lib/**/*.ts', ['ts-app']);
  gulp.watch('src/Oink.ts', ['ts-app']);
  gulp.watch('src/oink-manager.ts', ['ts-app']);
});

gulp.task('js-start', function () {
  gulp.run('js');
  gulp.watch('src/public/js/**/*.js', ['js']);
});

gulp.task('frontend-start', function () {
  gulp.run('js-start');
  gulp.run('style-start');
});

gulp.task('nodemon-start', function () {
  nodemon({
    script: './dist/app.js',
    ext: 'ts js'
  });
});

gulp.task('copy-static', function () {
  var to_copy = [
    {
      to: './dist/public/fonts/',
      list: [
        'node_modules/materialize-css/dist/fonts/roboto/',
        'node_modules/font-awesome/fonts/'
      ]
    }
  ];

  to_copy.forEach(function (copy) {
    fs.existsSync(copy.to) || fs.mkdirSync(copy.to);
    copy.list.forEach(function (dir) {
      fs.readdir(dir, function (err, files) {
        files.forEach(function (file) {
          console.log('Copying ' + file + ' to ' + copy.to);
          fs.createReadStream(dir + file)
            .pipe(fs.createWriteStream(copy.to + file));
        });
      });
    });
  });
});

gulp.task('test', function () {
  gulp.src('./test/api.js').pipe(mocha()).on('error', () => {});
});

gulp.task('full-stack-start', function () {
  gulp.run('copy-static');
  gulp.run('ts-start');
  gulp.run('js-start');
  gulp.run('style-start');
  gulp.run('nodemon-start');
});