'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require("tsify");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

gulp.task('build', function () {
	return [
		exec('tsc -p server'),

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
gulp.task('build-prod', function () {
	return [
		exec('tsc -p server'),

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