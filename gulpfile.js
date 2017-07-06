'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require("tsify");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var spawn = require('child_process').spawnSync;
var nodemon = require('gulp-nodemon');

gulp.task('build', () => {
	return [
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'server'], { stdio: 'inherit' }),
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'test'], { stdio: 'inherit' }),

		browserify({
			entries: ["./client/index.ts"],
			debug: true
		}).plugin(tsify)
			.bundle()
			.pipe(source('./client/index.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			// Add transformation tasks to the pipeline here.
			.on('error', gutil.log)
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./'))
	];
});

gulp.task('build-prod', () => {
	return [
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'server'], { stdio: 'inherit' }),
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'test'], { stdio: 'inherit' }),

		browserify({
			entries: ["./client/index.ts"],
			debug: true
		}).plugin(tsify)
			.bundle()
			.pipe(source('./client/index.js'))
			.pipe(buffer())
			// Add transformation tasks to the pipeline here.
			.pipe(uglify())
			.on('error', gutil.log)
			.pipe(gulp.dest('./'))
	];
});

gulp.task('start', (cb) => {
	spawn('node', ['server/index.js', 'server'], { stdio: 'inherit' });
});

gulp.task('test', () => {
	spawn('node', ['node_modules/mocha/bin/_mocha', '--recursive'], { stdio: 'inherit' });
});