var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bower = require('gulp-main-bower-files');
var sass = require('gulp-ruby-sass');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');

var paths = {
  dist: './dist',
  server: './server',
  bower: './bower_components',
  dev: './dev'
};

//minifies js, converts scss to css and minifies
gulp.task('build production', gulp.series(
  clean,
  gulp.parallel(minifyScripts, bowerScripts, styles, bowerStyles, icons)
));

//won't minify the js for easier bug-fixing
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(scripts, bowerScripts, handlebarsScripts, styles, bowerStyles, icons, images)
));

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series('build'));

//tasks
gulp.task(watch);
gulp.task(scripts);
gulp.task(minifyScripts);
gulp.task(styles);


function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  // If you are using del 2.0 or above, return its promise
  return del(['dist']);
}

function images(){
  return gulp.src(paths.dev + '/images/**/*')
  .pipe(gulp.dest(paths.dist + '/images'));
}

function scripts(){
  return gulp.src(paths.dev + '/js/**/*.js')
  .pipe(concat('our.js'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

function minifyScripts() {
  return gulp.src(paths.dev + '/js/**/*.js')
  .pipe(concat('our.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/js'));
}

function styles(){
  return sass(paths.dev + '/scss/**/*', {style: 'compressed'})
    .on('error', sass.logError)
    .pipe(concat('our.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
          }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist + '/styles'));
}

function bowerScripts() {
  return gulp.src('./bower.json')
    .pipe(bower({
      debugging: true,
      overrides: {
        // 'bootstrap': {    //uncomment for Bootstrap use
        //   main: [
        //     './dist/js/bootstrap.js'
        //   ]
        // }, 
        'jquery': {
          main: ['./dist/jquery.js']
        },
        'font-awesome': {
          ignore: true
        },
        'handlebars': {
          ignore: true
        },
        'what-input': {
          main: ['what-input.js']
        },
        'foundation-sites': {
          main: ['./dist/foundation.js']
        },
        'leaflet': {
          main: ['./dist/leaflet.js']
        }
      }
    }))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + '/js'));
}

function handlebarsScripts(){
  return gulp.src(paths.bower + '/handlebars/handlebars.js')
    .pipe(gulp.dest(paths.dist + '/js'));
}

function bowerStyles(){
  return gulp.src([paths.bower + '/font-awesome/css/font-awesome.css', paths.bower + '/foundation-sites/dist/foundation.min.css', paths.bower + '/leaflet/dist/leaflet.css'])
  .pipe(concat('vendor.css'))
  // .pipe(minifyCSS())
  .pipe(gulp.dest(paths.dist+ '/styles'));
}

function icons(){
  return gulp.src(paths.bower + '/font-awesome/fonts/*')
    .pipe(gulp.dest(paths.dist + '/fonts'));
}

function watch(){
  var js = paths.dev + '/js/**/*';
  var scss = paths.dev + '/scss/**/*';
  gulp.watch(js, scripts);
  gulp.watch(scss, styles);
}