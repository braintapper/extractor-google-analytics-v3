# Make sure that all gulp libs below are installed using `npm install`

'use strict'

series = require("gulp").series
parallel = require("gulp").parallel
watch = require("gulp").watch
task = require("gulp").task


sourceTask = require("./source.coffee")
testsTask = require("./tests.coffee")

task "source", sourceTask
task "tests", testsTask
task "default", sourceTask


task "bot", (cb)->
  watch sourceTask.watch, sourceTask
  watch testsTask.watch, testsTask
