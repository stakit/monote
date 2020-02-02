// this weird way to intialize and use this module
require('hot-module-replacement')({
  ignore: /node_modules/
})

var assert = require('assert')
var { watch } = require('chokidar')
var clearModule = require('clear-module')

var logger = require('./lib/logger')
var getServer = require('./lib/server')
var getWriter = require('./lib/writer')

module.exports = function (entryPath, rawOpts) {
  return new Promise(function (resolve) {
    assert(typeof entryPath === 'string', 'monote: entryPath must be a string')

    var opts = {
      port: 8080,
      logLevel: 'info',
      logStream: process.stdout
    }
    Object.assign(opts, rawOpts)

    var log = logger({
      logLevel: opts.logLevel,
      logStream: opts.logStream
    })

    // the current stakit chain
    // we initialize this before starting the server
    var kit = require(entryPath)

    var writer = getWriter()
    var server = getServer(writer, log).listen(opts.port)

    // when an asset was changed we must manually clear the module cache
    function handleAssetChange () {
      clearModule.all()
      handleChange()
    }

    function handleChange () {
      log.info({ message: '(rebuild)' })
      onUpdate()
    }

    function onUpdate () {
      writer.clear()
      kit = require(entryPath)
      kit.output(writer).then(function () {
        // resolve after the first build was finished
        resolve(server)
      })
    }

    onUpdate()

    // static files to watch
    var filesToWatch = kit._context._files
      .filter(file => !!file.source)
      .map(file => file.source)

    // append watched files that trigger the rebuild
    if (Array.isArray(kit._context._watch)) {
      filesToWatch = filesToWatch.concat(kit._context._watch)
    }

    // we set the max listeners, because there could be many many files.
    process.setMaxListeners(0)
    // we manually use only these events to avoid a lots of small updates. might change this in the future.
    watch(filesToWatch, {
      ignoreInitial: true
    })
      .on('add', handleAssetChange)
      .on('change', handleAssetChange)
      .on('unlink', handleAssetChange)

    if (module.hot) {
      module.hot.accept(entryPath, handleChange)
    }
    return server
  })
}
