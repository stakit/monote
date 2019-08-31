var garnish = require('garnish')
var pino = require('pino')

module.exports = logger

function logger (opts) {
  var pretty = garnish()
  pretty.pipe(process.stdout)

  var log = pino({
    logLevel: opts.logLevel,
    name: 'monote'
  }, pretty)

  return {
    stream: pretty,
    info: log.info.bind(log),
    warn: log.warn.bind(log),
    error: log.error.bind(log)
  }
}
