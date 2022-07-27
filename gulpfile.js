const { src, dest, parallel, watch, series } = require('gulp');
const concat = require('gulp-concat');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const FilesPath = {
  sassFiles: './src/sass/**/*.scss',
  htmlFiles: './src/views/**/*.pug',
  jsFiles: './src/script/*.js',
  assetsFiles: './src/assets/*',
};

function sassTask() {
  return gulp
    .src(FilesPath.sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return gulp
    .src(FilesPath.htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest('./public'))
    .pipe(browserSync.stream());
}
function jsTask() {
  return src(FilesPath.jsFiles)
    .pipe(concat('all.js'))
    .pipe(dest('./public/js'));
}
function assetsTask() {
  return src(FilesPath.assetsFiles).pipe(dest('./public/assets'));
}

function serve() {
  browserSync.init({ server: { baseDir: './public' } });
  watch(FilesPath.assetsFiles, assetsTask);
  watch(FilesPath.htmlFiles, htmlTask);
  watch(FilesPath.sassFiles, sassTask);
  watch(FilesPath.jsFiles, jsTask);
}
exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));
