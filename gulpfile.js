var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bower = require('gulp-main-bower-files');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');

var paths = {
  dist: './dist',
  server: './server',
  bower: './bower_components',
  dev: './dev',
  test: './test'
};

//minifies js, converts scss to css and minifies
gulp.task('production', gulp.series(
  clean,
  gulp.parallel(fnMinifyScripts, gameMinifyScripts, profileMinifyScripts, userMinifyScripts, bowerScripts, styles, bowerStyles, icons, images, testScripts, bowerTestScripts)
));

//won't minify the js for easier bug-fixing
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(fnScripts, gameScripts, profileScripts, userScripts, bowerScripts, styles, bowerStyles, icons, images, testScripts, bowerTestScripts)
));

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series('build'));

//tasks
gulp.task(watch);
gulp.task(styles);


function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  // If you are using del 2.0 or above, return its promise
  return del(['dist']);
}

function images(){
  return gulp.src(paths.dev + '/images/**/*')
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest(paths.dist + '/images'));
}

function fnScripts(){
  return gulp.src(paths.dev + '/js/functions/*.js')
  .pipe(concat('fn.js'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

function gameScripts(){
  return gulp.src(paths.dev + '/js/game/*.js')
  .pipe(concat('game.js'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

function profileScripts(){
  return gulp.src(paths.dev + '/js/profile/*.js')
  .pipe(concat('profile.js'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

function userScripts(){
  return gulp.src(paths.dev + '/js/users/*.js')
  .pipe(concat('user.js'))
  .pipe(gulp.dest(paths.dist + '/js'));
}

function testScripts(){
  return gulp.src(paths.test + '**/*.js')
  .pipe(gulp.dest(paths.dist + '/js/'));
}

function fnMinifyScripts(){
  return gulp.src(paths.dev + '/js/functions/*.js')
  .pipe(concat('fn.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/js'));
}

function gameMinifyScripts(){
  return gulp.src(paths.dev + '/js/game/*.js')
  .pipe(concat('game.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/js'));
}

function profileMinifyScripts(){
  return gulp.src(paths.dev + '/js/profile/*.js')
  .pipe(concat('profile.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/js'));
}

function userMinifyScripts(){
  return gulp.src(paths.dev + '/js/users/*.js')
  .pipe(concat('user.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/js'));
}

function styles(){
  return gulp.src(paths.dev + '/scss/**/*', {style: 'compressed'})
  	.pipe(sass().on('error', sass.logError))
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
          main: ['handlebars.js']
        },
        'what-input': {
          // main: ['what-input.js']
          ignore: true
        },
        'foundation-sites': {
          main: ['./dist/foundation.js']
        },
        'leaflet': {
          main: ['./dist/leaflet.js']
        },
        'chai': {
          ignore: true
        },
        'mocha': {
          ignore: true
        },
        'async': {
          main: ['./dist/async.min.js']
        }
      }
    }))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + '/js'));
}

function bowerTestScripts(){
  return gulp.src([paths.bower + '/mocha/mocha.js', paths.bower + '/chai/chai.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.dist + '/js/test'));
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
  var usr = paths.dev + '/js/users/*';
  var game = paths.dev + '/js/game/*';
  var profile = paths.dev + '/js/profile/*';
  var functions = paths.dev + '/js/functions/*';
  var scss = paths.dev + '/scss/**/*';
  var tsts = paths.test + '**/*';
  var imgs = paths.dev + '/images/**/*';
  gulp.watch(usr, userScripts);
  gulp.watch(profile, profileScripts);
  gulp.watch(functions, fnScripts);
  gulp.watch(game, gameScripts);
  gulp.watch(scss, styles);
  gulp.watch(tsts, testScripts);
  gulp.watch(imgs, images);
}
