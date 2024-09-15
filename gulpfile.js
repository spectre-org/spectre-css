import Fs from 'node:fs'
import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleancss from 'gulp-clean-css'
import csscomb from 'gulp-csscomb'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import autoprefixer from 'gulp-autoprefixer'
import prefixer from 'postcss-prefix-selector'
import postcss from 'gulp-postcss'
import { readFileSync } from 'fs'

const { series } = gulp
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const sass = gulpSass(dartSass)

const DIST_PATH = './dist'
const DOCS_PATH = '../spectre-docs/.vitepress/theme/styles/spectre'


// ---------------------------------------------------------------------------------------------------------------------
// utils
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Prefix and copy
 *
 * @param prefix    The CSS prefix to render
 * @param output    The output folder, defaults to './dist/prefixed'
 * @param names     The names of files to prefix, defaults to "*"
 * @param minOnly   Output minified files only, defaults to false
 *
 * @example
 *
 *  // everything to dist/prefixed
 *  prefix('main')
 *
 *  // spectre.css and spectre-exp.css only to dist/prefixed
 *  prefix('main', undefined, ['spectre', 'spectre-exp']
 *
 *  // spectre.css, minified only to parent docs project
 *  prefix('main', '../docs/styles', 'spectre.css', true)
 */
export function prefix (prefix, output = `${DIST_PATH}/prefixed`, names = '*', minOnly = false) {
  // variables
  // BUG: cannot get gulp.src() to ignore .css.min files with '!*.min.css' pattern
  names = names === '*'
    ? ['spectre', 'spectre-exp', 'spectre-icons']
    : typeof names === 'string'
      ? [names]
      : names
  const include = `${DIST_PATH}/{${names.join(',')}}.css`

  // do it
  const prefixed = gulp
    .src(include)
    .pipe(postcss([
      prefixer({
        prefix,
        exclude: [/\bhtml\S*/, /\bbody\S*/]
      })
    ]))

  // tasks
  const tasks = []
  if (!minOnly) {
    tasks.push(() => prefixed.pipe(gulp.dest(output)))
  }
  tasks.push(() => {
    return prefixed
      .pipe(cleancss())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(output))
  })

  // run
  return series(tasks)()
}

// ---------------------------------------------------------------------------------------------------------------------
// scripts
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Build and watch in development
 */
export function watch () {
  const tasks = [build]
  gulp.watch('./**/*.scss', build)
  if (Fs.existsSync(DOCS_PATH)) {
    gulp.watch(`${DIST_PATH}/spectre.css`, buildDocs)
    tasks.push(buildDocs)
  }
  series(tasks)()
}

/**
 * Build for distribution
 */
export function build () {
  return gulp
    .src('./src/*.scss')
    .pipe(replace(/%VERSION%/g, `v${pkg.version}`))
    .pipe(sass({ style: 'compact', precision: 10 })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(DIST_PATH))
}


/**
 * Build and for documentation
 */
export function buildDocs () {
  return prefix('.vp-doc', DOCS_PATH)
}
