"use strict";

const gulp       = require('gulp');
const nodemon    = require('gulp-nodemon');
const cache      = require('gulp-cache');
const concat     = require('gulp-concat');
const gulpIf     = require('gulp-if');
const imageMin   = require('gulp-imagemin');
const jshint     = require('gulp-jshint');
const annotate   = require('gulp-ng-annotate');
const notify     = require('gulp-notify');
const plumber    = require('gulp-plumber');
const pug        = require('gulp-pug');
const rename     = require('gulp-rename');
const srcMaps    = require('gulp-sourcemaps');
const stylus     = require('gulp-stylus');
const uglify     = require('gulp-uglify');
const merge      = require('merge-stream');
const bs         = require('browser-sync');
const errorLine  = Array(30).join('*');
const ENV        = process.env.APP_ENV || 'development';




// ==================================================
// PATHS FOR SOURCE & BUILD
// ==================================================

const paths = {
  src: {
    indexPage: 'src/index.pug',
    templates: 'src/templates/**/*.pug',
    css: 'src/assets/css/main.styl',
    cssPartials: 'src/assets/css/**/*.styl',
    js: 'src/assets/js/**/*.js',
    images: 'src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)',
    fonts: 'src/assets/fonts/*.{eot,svg,ttf,woff,woff2}'
  },

  dest: {
    indexPage: 'public/',
    templates: 'public/templates',
    css: 'public/assets/css/',
    js: 'public/assets/js',
    fonts: 'public/assets/fonts',
    images: 'public/assets/images'
  }

};


// default task
gulp.task('default', ['serve']);

// ==================================================
// SERVE & WATCH
// ==================================================
gulp.task('serve', ['bSync'], function(){
  gulp.watch([paths.src.indexPage, paths.src.templates], ['htmlBuild', 'browserReload']);
  gulp.watch([paths.src.css, paths.src.cssPartials], ['cssBuild', 'browserReload']);
  gulp.watch(paths.src.js, ['jsBuild', 'browserReload']);

});


// ==================================================
// SERVER AND BROWSER SYNC TASKS
// ==================================================


// Browser Sync
// ************************
gulp.task('bSync', ['nodemon'], function(){
  bs.init(null, {
    open: "ui",
    proxy: 'http://localhost:3000',
    browser: "google chrome",
    port: 4000
  });
});

// NODEMON
// ************************
gulp.task('nodemon', ['assetsBuild'], function(){
  let started = false;
  return nodemon({
    script: 'server.js',
    watch: ['app/**/*.*', 'server.js']
  })
    .on('start', function(){
      // trigger browser-sync if not running
      if(!started){
        done();
      }
      started = true;
    })
    .on('restart', function(){
      // set delayed restart for browser-sync
      setTimeout(function(){
        reload();
      }, 500);
      console.log(errorLine + "\nRESTARTED NODEMON\n" + errorLine);
    });
});


// ==================================================
// ALL GULP TASKS
// ==================================================

// HTML BUILD
gulp.task('htmlBuild', function(){
  // main indexpage
  let homepage = gulp.src(paths.src.indexPage)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "PUG COMPILE ERROR!",
        sound: "Ping"
      })
    }))
    .pipe(pug())
    .pipe(gulp.dest(paths.dest.indexPage));

  // templates
  let templates = gulp.src(paths.src.templates)
    .pipe(plumber({
      errorHandler: notify.onError({
        message: "Error: <%= error.message %>",
        title: "PUG COMPILE ERROR!",
        sound: "Ping"
      })
    }))
    .pipe(pug())
    .pipe(gulp.dest(paths.dest.templates));

    return merge(homepage, templates);

});

// CSS BUILD
gulp.task('cssBuild', function(){
  return gulp.src(paths.src.css)
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'STYLUS COMPILE ERROR',
        message: 'Error: <%= error.message %>',
        sound: 'Hero'
      })
    }))
    .pipe(srcMaps.init())
    .pipe(stylus({
      compress: true
    }))
    .pipe(srcMaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.dest.css));
});

// JS BUILD
gulp.task('jsBuild', function(){
  return gulp.src(paths.src.js)
  .pipe(plumber(function(){
    console.log(errorLine + "\nERROR BUILDING JS!\n" + errorLine);
    this.emit('end');
  }))
  .pipe(jshint())
  .pipe(notify({
    sound: "Blow",
    message: function(file){
      if (file.jshint.success) {
          // Report nothing if it's all good
          return false;
        }
      var errors = file.jshint.results.map(function(data){
      if (data.error) {
        return "(" + data.error.line + data.error.character + ")" + data.error.reason;
      }}).join("\n");

      return file.relative + "(" + file.jshint.results.length + " errors)\n" + errors;
    }
  }))
  .pipe(concat('app.js'))
  .pipe(annotate())
  .pipe(gulpIf("*.js", uglify()))
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(paths.dest.js));
});

// FONTS BUILD
gulp.task('fontsBuild', function(){
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dest.fonts));
});

// IMAGES BUILD
gulp.task('imagesBuild', function(){
  return gulp.src(paths.src.images)
    .pipe(cache(imageMin()))
    .pipe(gulp.dest(paths.dest.images));
});

// ASSETS BUILD
gulp.task('assetsBuild',['fontsBuild', 'imagesBuild']);

// BROWSER RELOAD
gulp.task('browserReload', function(done){
  bs.reload();
  done();
});

// PRODUCTIONS BUILD
gulp.task('productionBuild', [
  'imagesBuild',
  'fontsBuild',
  'htmlBuild',
  'cssBuild',
  'jsBuild'
]);
