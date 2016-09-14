/**
 * Created by paul.watkinson on 14/09/2016.
 */

'use strict';

const path = require('path');
const gulp = require('gulp');
const screeps = require('gulp-screeps');

const credentials = require('./credentials.json');

const DIR_BASE = __dirname.replace(/\\/g, '/');
const DIR_SRC = path(DIR_BASE, 'src');

gulp.task('push', () => {
    gulp.src(path.join(DIR_SRC, '**/*.js'))
        .pipe(screeps(credentials));
});
