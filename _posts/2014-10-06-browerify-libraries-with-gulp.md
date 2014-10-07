---
layout: post
title: "Browserifying Libraries With Gulp Using Require and Expose"
description: "Mechanisms - Blurring the Distinction Between Languages, Operating Systems and Frameworks"
category: Design
tags: [node, npm, require, expose, browserify, gulp, ]
author: Eric Hosick
author_twitter: erichosick
---

# Creating A Browserified Library With Gulp

The github project is [here](https://github.com/erichosick/nodeboxrequire).

If, in the browser, you get the error "Uncaught Error: Cannot find module" followed by the name of your module, then you've come to the right place.

Hopefully, this will give you some hints about how Browserify allows you to require node modules on your site.

## Install Browserify Globally

If you haven't done so already, install browserify globally:

    $ npm install browserify -g
    
# What We Will Do

Let's say you have a module with multiple functions you want to export as a library.

For example:

    // see robot.js
    
    var robotParents = require('./robotparent.js');

    module.exports.say = function(say) {
      return "Robots say " + say;
    };
    module.exports.yell = function(say) {
      return "Robots parents are like '" + robotParents.beep(say) + "'!";
    };

And we want to use that as a require('robot') in an html file like so:

    // see index.html
    
    <html>
      <body>
        <script src="robot.browser.js"></script>
        <script>
          var robots = require('robot');
          var parents = require('./robotparent.js');
          console.log(robots.yell("hello"));
          console.log(robots.say("hi"));
          console.log(parents.beep("argh"));
        </script>
      </body>
    </html>
    
We are exporting our entire library so it can be used in the browser.

## Using the Command Line

We can run the following in the command line:

    $ browserify -r ./robotparent.js -r ./robot.js:robot > robot.browser.js
    
What is really important is that:

* Use -r or --require to allow you to require your library in the browser.
* Use "./robot.js" and NOT "robot.js"
  * We are able to get access to both the robotparent and robot libraries.
  * Notice the parent library is required as follows './robotparent.js'.
* The library name is whatever you put after the : (in this case robot)

## Using Gulp

### Setup Gulp and npm's

    $ npm install
    
    $ npm install browserify --save-dev
    $ npm install vinyl-transform --save-dev
    $ npm install gulp-rename --save-dev
    
### The Gulp File

    var gulp = require('gulp');
    var browserify = require('browserify');
    var rename = require('gulp-rename');
    var transform = require('vinyl-transform');

    gulp.task('default', ['browserify']);

    gulp.task('browserify', function() {
      var browserified = transform(function(filename) {
        return browserify()
          .require('./robot.js', {expose: 'robot'})
          .require('./robotparent.js', {expose: './robotparent.js'})
          .bundle();
      });

      return gulp.src('robot.js')
        .pipe(browserified)
        .pipe(rename('robot.browser.js'))
        .pipe(gulp.dest('.'));
    });

The important bits are the require and bundle bits.

For every library we want to expose, we have to use '.require'. In this case, we want to expose robot.js and robotparent.js.

There are ways to automate the exposing of files ([External Bundles with Browserify](http://9elements.com/io/index.php/external-bundles-with-browserify-and-gulp/)) but we are keeping things simple.

### Running The Gulp Command

    $ gulp
    
This causes the 'default' task to run which calls the 'browserify' task.
    

