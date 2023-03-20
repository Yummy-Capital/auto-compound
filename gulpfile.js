const { series, task } = require('gulp');
const tasks = require('./gulp');

task('clean', tasks.clean);
task('compile', tasks.compile);

task('build', series('clean', 'compile'));
