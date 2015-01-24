/* jshint node: true */
'use strict';

var args = require('yargs').argv,
	async = require('async'),
	clean = require('gulp-clean'),
	gulp = require('gulp'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint');

var publishFolder = '../publish',
	npmRegistry = 'https://registry.npmjs.org/';

gulp.task('lint', function() {
	return gulp.src(['../**/*.js', '!../**/node_modules/**/*.js', '!' + __dirname])
		.pipe(jshint());
});

gulp.task('test', function () {
    return gulp.src('../spec/**/*.spec.js')
        .pipe(jasmine());
});

gulp.task('clean', ['lint', 'test'], function() {
	return gulp.src(publishFolder, { read: false })
		.pipe(clean({ force: true }));
});

gulp.task('build', ['clean'], function() {
	return gulp.src(['../lib/**', '../*.json', '../*.md', '../*.js'], { base: '../' })
		.pipe(gulp.dest(publishFolder));
});

gulp.task('default', ['lint', 'test', 'clean', 'build']);