var path = require('path')
var http = require('http')
var chalk = require('chalk')
var loghttp = require('log-http')
var mime = require('mime')

module.exports = start

function start (writer, log) {
  return {
    listen,
    handler
  }

  // catch all routes
  function handler (req, res) {
    var filePath = path.extname(req.url) ? req.url : path.join(req.url, 'index.html')
    var file = writer.get(filePath)

    if (file) {
      res.writeHead(200, { 'content-type': mime.getType(filePath) })
      res.end(file)
    } else {
      res.writeHead(404)
      res.end('Not Found')
    }
  }

  function listen (port) {
    // server
    var server = http.createServer(handler)

    var stats = loghttp(server)
    stats.on('data', function (level, data) {
      log[level](data)
    })

    server.listen(port, function () {
      log.info({
        message: 'dev server listening on port ' + chalk.bold(port)
      })
    })

    return server
  }
}
