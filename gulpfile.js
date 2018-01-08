const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const fs = require('fs');
const Acl = require('acl');
const mongodb = require('mongodb');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const { createPassword } = require('./dist/oink/auth');


gulp.task('build', (done) => {
  webpack(webpackConfig(), (err, multiStats) => {
    if (err) {
      const pluginError = new gulpUtil.PluginError('webpack', err);
      done(pluginError);
    } else {
      multiStats.stats.forEach((stats) => {
        gulpUtil.log('[webpack]', stats.toString({
          chunks: false,
          children: false,
          colors: true,
          cached: false,
          cachedAssets: false,
        }));
      });
    }
  });
});
gulp.task('build:start', (done) => {
  const watchingWebpackConfig = webpackConfig('dev');
  process.env.UV_THREADPOOL_SIZE = 4;
  webpack(watchingWebpackConfig, (err, multiStats) => {
    if (err) {
      const pluginError = new gulpUtil.PluginError('webpack', err);
      done(pluginError);
    } else {
      multiStats.stats.forEach((stats) => {
        gulpUtil.log('[webpack]', stats.toString({
          chunks: false,
          children: false,
          colors: true,
          cached: false,
          cachedAssets: false,
        }));
      });
    }
  });
});

gulp.task('nodemon', () => {
  nodemon({
    script: './dist/app.js',
    ext: 'js',
    exclude: './dist/public/*',
  });
});

gulp.task('create-static', () => {
  fs.existsSync('./dist/') || fs.mkdirSync('./dist/');
  fs.existsSync('./dist/public') || fs.mkdirSync('./dist/public');
  fs.existsSync('./dist/public/js') || fs.mkdirSync('./dist/public/js');
  fs.existsSync('./dist/public/fonts') || fs.mkdirSync('./dist/public/fonts');
  fs.existsSync('./dist/public/css') || fs.mkdirSync('./dist/public/css');
});

gulp.task('copy-static', () => {
  const to_copy = [
    {
      to: './src/oink/fonts/',
      list: [
        'node_modules/materialize-css/dist/fonts/',
        'node_modules/font-awesome/fonts/',
      ],
    },
  ];

  to_copy.forEach((copy) => {
    fs.existsSync(copy.to) || fs.mkdirSync(copy.to);
    copy.list.forEach((dir) => {
      fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
          console.log(`Copying ${file} to ${copy.to}`);
          fs.createReadStream(dir + file)
            .pipe(fs.createWriteStream(copy.to + file));
        });
      });
    });
  });
});

gulp.task('test', () => {
  gulp.src('./test/api.js').pipe(mocha()).on('error', e => e);
});

gulp.task('create:superuser', () => {
  mongodb.connect(process.env.OINK_MONGO_PATH || 'mongodb://localhost:27017/oink', (e, dbMongo) => {
    const acl = new Acl(new Acl.mongodbBackend(dbMongo, 'acl'));
    const passPair = createPassword('admin');
    dbMongo.collection('users').insertOne({
      login: 'admin',
      name: 'Superadmin',
      password: passPair.pass,
      salt: passPair.salt,
    }).then((r) => {
      acl.addUserRoles(r.insertedId.toString(), 'superadmin').then(() => acl.hasRole(r.insertedId.toString(), 'user')).then(() => {
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

gulp.task('default', () => {
  gulp.run('create-static');
  gulp.run('copy-static');
  gulp.run('style');
  gulp.run('js');
});
