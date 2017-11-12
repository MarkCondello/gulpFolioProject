var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
//my installed extensions
var htmlmin = require('gulp-htmlmin');
var uncss = require('gulp-uncss');//not working

gulp.task('css', function(){
	return gulp.src('src/sass/**/*.scss') // matches any file ending with .scss in the root folder and any child directories.
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compress'}).on('error', sass.logError)) // compress and provide error log file
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./maps'))		
		/*my additional uncss extension included
		.pipe(uncss({
			html: ['http://localhost:3000/']
		}))
			*/
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())	
});

gulp.task('images', function(){
	return gulp.src('src/images/*') // grab every image in the images folder
		.pipe(imagemin())//run the image min module on each image
		.pipe(gulp.dest('dist/images'))	//outout the minified images in dist/images
});


gulp.task('copy', function(){
	return gulp.src('src/**/*.+(html|js)')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});
//will search for html and js files and copy them to dist

gulp.task('browserSync', function(){
	browserSync.init({//initialize browser sync and tell the program where the root server resides
		server:{
			baseDir: 'dist'
		},
	})
});
// now to tell the browser to update when changes are made we need to update the copy and the css task.
//It is important to run browserSync after the other pipes to ensure that other changes have applied before streaming the update to the browser

gulp.task('watch', ['browserSync', 'css'], function(){
	gulp.watch('src/sass/**/*.scss', ['css']);//if scss files are changed run css task
	gulp.watch('src/**/*.+(html|js)', ['copy']);//if html or js files are changed run copy task

});

//the array in the parenthesis is an option to run the tasks therein before the rest of the code begins
// after running gulp watch, the browser opens the page


//installed html minify from here https://www.npmjs.com/package/gulp-htmlmin
gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});
