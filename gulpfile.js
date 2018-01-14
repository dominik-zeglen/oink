const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const nodemon = require('gulp-nodemon');
const fs = require('fs');
const Acl = require('acl');
const mongodb = require('mongodb');
const webpack = require('webpack');
const prompt = require('gulp-prompt');
const rename = require('gulp-rename');
const queue = require('async/queue');
const graphql = require('graphql');

const webpackConfig = require('./webpack.config');
const graphQLSchemaGen = require('./dist/oink/graphql');
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
  fs.existsSync('./dist/public/oink') || fs.mkdirSync('./dist/public/oink');
  fs.existsSync('./dist/public/oink/fonts') || fs.mkdirSync('./dist/public/oink/fonts');
  fs.existsSync('./dist/public/oink/fonts/roboto') || fs.mkdirSync('./dist/public/oink/fonts/roboto');
  fs.existsSync('./dist/public/oink/images') || fs.mkdirSync('./dist/public/oink/images');
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

gulp.task('create:graphql-schema', (done) => {
  fs.writeFile('./schema.graphqls', graphql.printSchema(graphQLSchemaGen()), done);
});

gulp.task('create:migration', () => gulp.src('.')
  .pipe(prompt.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter migration name',
  }, (migration) => {
    gulp.src('./migrations/base_migration.js')
      .pipe(rename(`${migration.name}_${+(new Date())}.js`))
      .pipe(gulp.dest('./migrations/'));
  })));

gulp.task('migrate', (done) => {
  let doneMigrations;
  if (fs.existsSync('./migration_status.json')) {
    doneMigrations = JSON.parse(fs.readFileSync('./migration_status.json').toString());
  } else {
    doneMigrations = { list: [] };
  }
  const onGoingMigrations = { list: [] };
  fs.readdir('./migrations/', (err, files) => {
    const q = queue((task, cb) => {
      console.log(`Applying migration ${task.name}`);
      cb();
    }, 1);
    files.forEach((file) => {
      if (file !== 'base_migration.js' && !doneMigrations.list.includes(file)) {
        onGoingMigrations.list.push(file);
        q.push({ name: file.replace('.js', '') }, (function (err) {
          require(`./migrations/${this}`);
        }).bind(file));
      }
    });
    q.drain = () => {
      const allMigrations = {};
      allMigrations.list = onGoingMigrations.list.concat(doneMigrations.list);
      fs.writeFile('./migration_status.json', JSON.stringify(allMigrations), (saveError) => {
        done();
      });
    };
  });
});

gulp.task('default', () => {
  gulp.run('create-static');
  gulp.run('build');
});
