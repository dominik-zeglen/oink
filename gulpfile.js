const gulp = require("gulp");
const gulpUtil = require("gulp-util");
const nodemon = require("gulp-nodemon");
const fs = require("fs");
const Acl = require("acl");
const mongodb = require("mongodb");
const webpack = require("webpack");
const prompt = require("gulp-prompt");
const rename = require("gulp-rename");
const queue = require("async/queue");
const graphql = require("graphql");
const monk = require("monk");
const faker = require("faker");
const _ = require("lodash");

const { createPassword } = require("./dist/oink/auth");
const { addContainer } = require("./dist/oink/core/containers");
const { addModule } = require("./dist/oink/core/object_modules");
const { addObject } = require("./dist/oink/core/objects");
const {
  addPermission,
  permissionTypes,
  resources
} = require("./dist/oink/core/permissions");
const { addUser, addUserRole } = require("./dist/oink/core/users");

const webpackConfig = require("./webpack.config");

gulp.task("build", done => {
  webpack(webpackConfig(), (err, multiStats) => {
    if (err) {
      const pluginError = new gulpUtil.PluginError("webpack", err);
      done(pluginError);
    } else {
      multiStats.stats.forEach(stats => {
        gulpUtil.log(
          "[webpack]",
          stats.toString({
            chunks: false,
            children: false,
            colors: true,
            cached: false,
            cachedAssets: false
          })
        );
      });
    }
  });
});
gulp.task("build:start", done => {
  const watchingWebpackConfig = webpackConfig("dev");
  process.env.UV_THREADPOOL_SIZE = 4;
  webpack(watchingWebpackConfig, (err, multiStats) => {
    if (err) {
      const pluginError = new gulpUtil.PluginError("webpack", err);
      done(pluginError);
    } else {
      multiStats.stats.forEach(stats => {
        gulpUtil.log(
          "[webpack]",
          stats.toString({
            chunks: false,
            children: false,
            colors: true,
            cached: false,
            cachedAssets: false
          })
        );
      });
    }
  });
});

gulp.task("nodemon", () => {
  nodemon({
    script: "./dist/app.js",
    ext: "js",
    exclude: "./dist/public/*"
  });
});

gulp.task("create-static", () => {
  fs.existsSync("./dist/") || fs.mkdirSync("./dist/");
  fs.existsSync("./dist/public") || fs.mkdirSync("./dist/public");
  fs.existsSync("./dist/public/oink") || fs.mkdirSync("./dist/public/oink");
  fs.existsSync("./dist/public/oink/fonts") ||
    fs.mkdirSync("./dist/public/oink/fonts");
  fs.existsSync("./dist/public/oink/fonts/roboto") ||
    fs.mkdirSync("./dist/public/oink/fonts/roboto");
  fs.existsSync("./dist/public/oink/images") ||
    fs.mkdirSync("./dist/public/oink/images");
});

gulp.task("create:superuser", () => {
  mongodb.connect(
    process.env.OINK_MONGO_PATH || "mongodb://localhost:27017/oink",
    (e, dbMongo) => {
      const acl = new Acl(new Acl.mongodbBackend(dbMongo, "acl"));
      const passPair = createPassword("admin");
      dbMongo
        .collection("users")
        .insertOne({
          login: "admin",
          name: "Superadmin",
          pass: passPair.pass,
          salt: passPair.salt
        })
        .then(r => {
          acl
            .addUserRoles(r.insertedId.toString(), "superadmin")
            .then(() => acl.hasRole(r.insertedId.toString(), "user"))
            .then(() => {
              console.log("User created");
              process.exit();
            })
            .catch(e => {
              console.log(e.message);
              console.log(e.stack);
              process.exit();
            });
        })
        .catch(e => {
          console.log(e.message);
          console.log(e.stack);
          process.exit();
        });
    }
  );
});

gulp.task("create:migration", () =>
  gulp.src(".").pipe(
    prompt.prompt(
      {
        type: "input",
        name: "name",
        message: "Enter migration name"
      },
      migration => {
        gulp
          .src("./migrations/base_migration.js")
          .pipe(rename(`${migration.name}_${+new Date()}.js`))
          .pipe(gulp.dest("./migrations/"));
      }
    )
  )
);

gulp.task("create:container", done => {
  const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
  const db = monk(dbPath);

  addContainer(db, {
    name: faker.company.companyName(),
    description: faker.lorem.paragraphs(3),
    parentId: null,
    visible: true
  })
    .then(r => {
      db.close();
      done();
    })
    .catch(err => done(err));
});
gulp.task("create:sample-data", async done => {
  const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
  const db = monk(dbPath);
  const mongoClient = await mongodb.connect(dbPath);
  const acl = new Acl(new Acl.mongodbBackend(mongoClient, "acl"));
  faker.seed(99);

  const fieldTypes = _.times(10, faker.random.word);
  const parentContainerPromises = _.times(4, () =>
    addContainer(db, {
      name: faker.random.words(3),
      description: faker.lorem.paragraphs(3),
      parentId: null,
      visible: true
    }).catch(e => done(e))
  );
  const parentContainers = await Promise.all(parentContainerPromises);

  const containerChildrenPromises = _.flatten(
    parentContainers.map(parent =>
      _.times(6, () => {
        const newContainer = {
          name: faker.random.words(3),
          description: faker.lorem.paragraphs(3),
          parentId: parent._id,
          visible: faker.random.number(6) > 4
        };
        return addContainer(db, newContainer).catch(e => done(e));
      })
    )
  );
  const containers = [
    ...parentContainers,
    ...(await Promise.all(containerChildrenPromises))
  ];

  const modulePromises = _.times(3, () =>
    addModule(db, {
      name: faker.random.words(4),
      description: faker.lorem.sentences(3),
      fields: _.times(faker.random.number(5), () => ({
        displayName: faker.random.word(),
        type: fieldTypes[faker.random.number(9)]
      }))
    }).catch(e => done(e))
  );
  const modules = await Promise.all(modulePromises);

  const objectPromises = containers.map(container =>
    _.times(faker.random.number(10), () => {
      const moduleObject = modules[faker.random.number(2)];
      return addObject(db, {
        name: faker.random.words(4),
        module: moduleObject._id,
        parentId: container._id,
        fields: moduleObject.fields.map(field => ({
          name: field.name,
          value: faker.random.words(4)
        })),
        visible: faker.random.number(5) > 3
      }).catch(e => done(e));
    })
  );
  await Promise.all(objectPromises);

  const userPromises = _.times(faker.random.number(20), () =>
    addUser(db, {
      name: faker.name.title(),
      login: faker.internet.userName(),
      password: faker.internet.password()
    })
  );
  const users = await Promise.all(userPromises);

  const rolePromises = _.times(faker.random.number(8), () =>
    addPermission(acl, {
      name: faker.name.jobTitle(),
      resources: [resources[faker.random.number(resources.length - 1)]],
      permissions: [
        permissionTypes[faker.random.number(permissionTypes.length - 1)]
      ]
    })
  );
  const roles = await Promise.all(rolePromises);

  const userRolePromises = users.map(user =>
    addUserRole(acl, user._id, roles[faker.random.number(7)].name)
  );
  await Promise.all(userRolePromises);

  db.close();
  done();
});

// TODO: Save migration state in database
gulp.task("migrate", done => {
  let doneMigrations;
  if (fs.existsSync("./migration_status.json")) {
    doneMigrations = JSON.parse(
      fs.readFileSync("./migration_status.json").toString()
    );
  } else {
    doneMigrations = { list: [] };
  }
  const onGoingMigrations = { list: [] };
  fs.readdir("./migrations/", (err, files) => {
    const q = queue((task, cb) => {
      console.log(`Applying migration ${task.name}`);
      cb();
    }, 1);
    files.forEach(file => {
      if (file !== "base_migration.js" && !doneMigrations.list.includes(file)) {
        onGoingMigrations.list.push(file);
        q.push(
          { name: file.replace(".js", "") },
          function(err) {
            require(`./migrations/${this}`);
          }.bind(file)
        );
      }
    });
    q.drain = () => {
      const allMigrations = {};
      allMigrations.list = onGoingMigrations.list.concat(doneMigrations.list);
      fs.writeFile(
        "./migration_status.json",
        JSON.stringify(allMigrations),
        saveError => {
          done();
        }
      );
    };
  });
});

gulp.task("default", () => {
  gulp.run("create-static");
  gulp.run("build");
});
