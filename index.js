// This weird way to intialize and use this module
require('hot-module-replacement')({
  ignore: /node_modules/
})

var concat = require('concat-stream')
var merry = require('merry')
var path = require('path')
var chalk = require('chalk')
var pump = require('pump')

module.exports = function (entryPath, opts) {
  entryPath = resolve(entryPath)

  var files = new Map()
  var kit = null

  // simple writer that saves the concatinated result into a Map
  var writer = {
    write: function (file) {
      pump(file.stream, concat({ encoding: 'string' }, saveData), function (err) {
        if (err) throw err
      })

      function saveData (data) {
        files.set(file.destination, data)
      }
    }
  }

  function onUpdate () {
    files.clear()
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
    console.log(chalk.magenta('(rebuild)'))
    onUpdate()
  })

  // start server
  var server = merry({ logLevel: 'warn' })

  // catch all route
  server.route('GET', '*', function (req, res, ctx) {
    var filePath = path.extname(req.url) ? req.url : path.join(req.url, 'index.html')
    var file = files.get(filePath)

    if (file) {
      ctx.send(200, file)
    } else {
      ctx.send(404, 'Not Found')
    }
  })

  console.log(`\n${chalk.bold.gray('monote')}\n`)
  console.log(`development server is running on port ${chalk.bold.yellow(opts.port)}...`)

  server.listen(opts.port)
}

function resolve (str) {
  return path.isAbsolute(str) ? str : path.resolve(str)
}
