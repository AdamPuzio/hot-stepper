"use strict";

const { src, dest, series, parallel } = require('gulp')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const babel = require('gulp-babel')
const terser = require('gulp-terser-js')
const del = require('del')
const rollup = require('gulp-rollup')
const eslint = require('gulp-eslint')
const sourcemaps = require('gulp-sourcemaps')

function clean(cb) {
  return del('./dist/')
}

function css(cb) {
  return src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(dest('./dist/css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('./dist/css/'))
}

function javascript(cb) {
  let destFolder = './dist/js/'
  return src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(rollup({
      format: 'umd',
      moduleName: 'HotStepper',
      entry: './src/js/hot-stepper.js',
      //entry: './src/js/main.js',
      //sourcemap: false
    }))
    .pipe(rename('hot-stepper.es2015.js'))
    .pipe(dest(destFolder)) // --> writing rolledup
    // ----------- babelizing --------------
    .pipe(babel())
    .pipe(rename('hot-stepper.js'))
    .pipe(dest(destFolder)) // --> writing babelized ES5
    // ----------- minifying --------------
    .pipe(terser({
       mangle: {
         toplevel: true
       }
    }))
    .pipe(rename('hot-stepper.min.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(destFolder))
}

function lint() {
  return src(["./src/js/**/*", "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

const js = series(lint, javascript)
const build = series(clean, parallel(css, js))

module.exports = {
  js: js,
  css: css,
  clean: clean,
  build: build,
  default: build
}