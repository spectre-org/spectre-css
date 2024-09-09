import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleancss from 'gulp-clean-css'
import csscomb from 'gulp-csscomb'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import autoprefixer from 'gulp-autoprefixer'
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const sass = gulpSass(dartSass)

export function build () {
  return gulp
    .src('./src/*.scss')
    .pipe(replace(/%VERSION%/g, `v${pkg.version}`))
    .pipe(sass({ style: 'compact', precision: 10 })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./dist'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'))
}

export function watch () {
  gulp.watch('./**/*.scss', build)
}
