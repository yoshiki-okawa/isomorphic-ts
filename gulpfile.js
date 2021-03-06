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

gulp.task('build', () => {
	return [
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'server'], { stdio: 'inherit' }),
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'test'], { stdio: 'inherit' }),

		browserify({
			entries: ["./index.ts"],
			debug: true,
			basedir: './client'
		}).plugin(tsify, {project:'./client'})
			.bundle()
			.pipe(source('index.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			// Add transformation tasks to the pipeline here.
			.on('error', gutil.log)
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./client'))
	];
});

gulp.task('build-prod', () => {
	return [
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'server'], { stdio: 'inherit' }),
		spawn('node', ['node_modules/typescript/bin/tsc', '-p', 'test'], { stdio: 'inherit' }),

		browserify({
			entries: ["./index.ts"],
			basedir: './client'
		}).plugin(tsify, {project:'./client'})
			.bundle()
			.pipe(source('index.js'))
			.pipe(buffer())
			// Add transformation tasks to the pipeline here.
			.pipe(uglify())
			.on('error', gutil.log)
			.pipe(gulp.dest('./client'))
	];
});

gulp.task('start', (cb) => {
	spawn('node', ['server/out/server/index.js', 'server'], { stdio: 'inherit' });
});

gulp.task('test', () => {
	spawn('node', ['node_modules/mocha/bin/_mocha', '--recursive'], { stdio: 'inherit' });
});