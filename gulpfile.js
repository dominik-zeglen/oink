const gulp = require('gulp');
const watchify = require('watchify');
const browserify = require('browserify');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const fs = require('fs');
const Acl = require('acl');
const mongodb = require('mongodb');
const createPassword = require('./dist/oink/auth').createPassword;


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

gulp.task('js-start', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['./src/public/js/oink.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
  })
    .transform('babelify', {presets: ['env', 'react']})
    .bundle()
    .pipe(fs.createWriteStream('./dist/public/js/oink.js'));
});

gulp.task('frontend-start', function () {
  gulp.run('js-start');
  gulp.run('style-start');
});

gulp.task('nodemon-start', function () {
  nodemon({
    script: './dist/app.js',
    ext: 'js',
    exclude: './dist/public/*'
  });
});

gulp.task('create-static', function () {
  fs.existsSync('./dist/') || fs.mkdirSync('./dist/');
  fs.existsSync('./dist/public') || fs.mkdirSync('./dist/public');
  fs.existsSync('./dist/public/js') || fs.mkdirSync('./dist/public/js');
  fs.existsSync('./dist/public/fonts') || fs.mkdirSync('./dist/public/fonts');
  fs.existsSync('./dist/public/css') || fs.mkdirSync('./dist/public/css');
});

gulp.task('copy-static', function () {
  const to_copy = [
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
  gulp.src('./test/api.js').pipe(mocha()).on('error', (e) => {
    return e;
  });
});

gulp.task('full-stack-start', function () {
  gulp.run('copy-static');
  gulp.run('js-start');
  gulp.run('style-start');
  gulp.run('nodemon-start');
});

gulp.task('create-superuser', () => {
  mongodb.connect(process.env.OINK_MONGO_PATH, (e, dbMongo) => {
    let acl = new Acl(new Acl.mongodbBackend(dbMongo, 'acl'));
    let passPair = createPassword('admin');
    dbMongo.collection('users').insertOne({
      _id: 'admin',
      name: 'Superadmin',
      password: passPair.pass,
      salt: passPair.salt
    }).then((r) => {
      acl.addUserRoles(r.insertedId.toString(), 'superadmin').then(() => {
        return acl.hasRole(r.insertedId.toString(), 'user');
      }).then(() => {
        console.log('User created');
        process.exit();
      }).catch((e) => {
        console.log(e.message);
        console.log(e.stack);
        process.exit();
      });
    }).catch((e) => {
      console.log(e.message);
      console.log(e.stack);
      process.exit();
    });
  });
});

gulp.task('default', function () {
  gulp.run('create-static');
  gulp.run('copy-static');
  gulp.run('style');
  gulp.run('js');
});
