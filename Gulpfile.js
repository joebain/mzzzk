var gulp = require('gulp');  
var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');  
var sass = require('gulp-sass');  
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var sprite = require('css-sprite').stream;
var nodemon = require('gulp-nodemon');

var isDevelopment = (process.env.NODE_ENV || "development") === "development";
var buildDir = isDevelopment ? "build/development" : "build/production";

gulp.task('script', function() {  
	return gulp.src(['script/main.js'])
	.pipe(browserify({
		debug: isDevelopment
	}))
	.pipe(concat('main.js'))
	.pipe(gulp.dest(buildDir));
});

gulp.task('style', ['sprite'], function() {  
	var options = {
		includePaths: ['style']
	};
	if (isDevelopment) {
		options.sourceComments = "map";
	}
	return gulp.src(['style/main.scss'])
	.pipe(sass(options))
	.pipe(concat('main.css'))
	.pipe(gulp.dest(buildDir))
});

gulp.task('sprite', function() {
	return gulp.src('img/*.png')
	.pipe(sprite({
		name: 'main.png',
		style: '_sprite.scss',
		cssPath: './',
		processor: 'scss',
		prefix: 'mk-icon'
	}))
	.pipe(gulpif('*.png', gulp.dest(buildDir)))
	.pipe(gulpif('*.scss', gulp.dest('./style/')));
});

gulp.task('resources', function() {
	return gulp.src('res/**/*')
	.pipe(gulp.dest(buildDir));
});

gulp.task('build', ['style', 'script', 'resources']);

gulp.task('watch', ['build'], function() {
	gulp.watch('node_modules/**/*.js', ['script']);
	gulp.watch('script/**/*.js', ['script']);
	gulp.watch('templ/*.hbs', ['script']);
	gulp.watch('style/*.scss', ['style']);
	gulp.watch('img/*.png', ['sprite', 'style']);
	gulp.watch('res/**/*', ['resources']);
});

gulp.task('serve', ['watch'], function () {
  nodemon({
      watch: ['server/'],
      script: 'server/app.js',
      ext: 'html js hbs scss png',
      nodeArgs: [
          "--debug",
          "--harmony"
      ]
  })
})
