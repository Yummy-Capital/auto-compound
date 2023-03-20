const ts = require('gulp-typescript');
const path = require('node:path');
const rimraf = require('rimraf');

const tsProject = ts.createProject('tsconfig.json');

module.exports = function clean() {
  return new Promise((resolve, reject) =>
    rimraf(path.resolve(__dirname, '..', tsProject.config.compilerOptions?.outDir || 'build'), (err) =>
      err ? reject(err) : resolve(),
    ),
  );
};
