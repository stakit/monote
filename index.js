// this weird way to intialize and use this module
require('hot-module-replacement')({
  ignore: /node_modules/
})

var path = require('path')
var chalk = require('chalk')
var assert = require('assert')

var logger = require('./lib/logger')
var startServer = require('./lib/server')
var getWriter = require('./lib/writer')

module.exports = function (entryPath, rawOpts) {
  assert(typeof entryPath === 'string', 'monote: entryPath must be a string')

  var opts = {
    port: 8080,
    logLevel: 'info'
  }
  Object.assign(opts, rawOpts)

  var log = logger({
    logLevel: opts.logLevel
  })

  var writer = getWriter()

  // the current stakit chain
  var kit = null

  function onUpdate () {
    writer.clear()
    kit = require(entryPath)
    kit.output(writer)
  }
  onUpdate()

  // HMR files to watch
  var filesToWatch = kit._context._files
    .filter(file => !!file.source)
    .map(file => file.source)

  filesToWatch.push(entryPath)

  module.hot.accept(filesToWatch, function () {
    log.info({ message: '(rebuild)' })
    onUpdate()
  })

  startServer(opts.port, writer, log)
}
