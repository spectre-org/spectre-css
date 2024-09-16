import Fs from 'node:fs'
import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleancss from 'gulp-clean-css'
import csscomb from 'gulp-csscomb'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import gulpIf from 'gulp-if'
import autoprefixer from 'gulp-autoprefixer'
import prefixSelector from 'postcss-prefix-selector'
import prefixer from 'postcss-prefixer'
import postcss from 'gulp-postcss'
import { readFileSync } from 'fs'

const sass = gulpSass(dartSass)
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const DIST_PATH = './dist'
const DOCS_PATH = '../spectre-docs/.vitepress/theme/styles/spectre'

// ---------------------------------------------------------------------------------------------------------------------
// lib scripts
// ---------------------------------------------------------------------------------------------------------------------

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
 * Watch and rebuild for development
 */
export function watch () {
  return gulp.watch('./**/*.scss', { ignoreInitial: false }, build)
}

// ---------------------------------------------------------------------------------------------------------------------
// docs scripts
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Build and save docs stylesheets
 */
export function buildDocs () {
  const options = { output: DOCS_PATH, minOnly: true }
  isolate('namespace', '.vp-doc', options)
}

/**
 * Watch and rebuild docs stylesheets for development
 */
export function watchDocs () {
  return gulp.watch(`${DIST_PATH}/spectre.css`, { ignoreInitial: false }, buildDocs)
}

/**
 * Build and watch main lib, then namespace and save docs stylesheet to parallel docs repo
 */
export const docs = Fs.existsSync(DOCS_PATH)
  ? gulp.parallel(watch, watchDocs)
  : function () {
    console.log(`
The "spectre-docs" folder / repo was not found.

To build only "spectre-css" run "watch" or "build".
`)
    return Promise.resolve()
  }

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Isolate Options
 *
 * @typedef   {Object}            IsolateOptions
 * @property  {string|string[]}   [names]       The names of files to prefix, defaults to "*" (all)
 * @property  {string}            [output]      The output folder, defaults to './dist' (overwrites files)
 * @property  {boolean}           [minOnly]     Output minified files only, defaults to false
 */

/**
 * Utility function to isolate classes and save files
 *
 * @param {'prefix'|'namespace'}  type        The operation to run
 * @param {string}                value       The string to use in the operation
 * @param {IsolateOptions}        [options]   Options to customise the isolation
 *
 * @example
 *
 *  // build all files, namespace to main, and save to dist/isolated
 *  isolate('namespace', 'main')
 *
 *  // build only main and exp, namespace to .docs, and save to dist/isolated
 *  isolate('namespace', '.docs', { names: ['spectre', 'spectre-exp'] })
 *
 *  // build all files, prefix with `s-`, save minified files only to
 *  isolate('prefix', 's-', { output: '../docs/styles', minOnly: true })
 */
function isolate (type, value, options = {}) {
  // defaults
  options = Object.assign({
    names: '*',
    output: `${DIST_PATH}/${type}`,
    minOnly: false
  }, options)

  // options
  let { names, output, minOnly } = options

  // paths
  // BUG: cannot get gulp.src() to ignore .css.min files with '!*.min.css' pattern so hardcoding names 😕
  names = names === '*'
    ? ['spectre', 'spectre-exp', 'spectre-icons']
    : typeof names === 'string'
      ? [names]
      : names
  const include = `${DIST_PATH}/{${names.join(',')}}.css`

  // setup
  const exclude = [/\b:root\b/, /\bhtml\S*/, /\bbody\S*/]
  const plugin = type === 'namespace'
    ? prefixSelector({ prefix: value, exclude })
    : prefixer({ prefix: value.replace(/^\./, ''), ignore: exclude })

  // task
  return gulp
    .src(include)
    .pipe(postcss([plugin]))

    // output
    .pipe(gulpIf(!minOnly, gulp.dest(output)))

    // minified
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(output))
}
