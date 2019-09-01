var pump = require('pump')
var concat = require('concat-stream')

module.exports = writer

// simple writer that saves the concatinated result into a Map
function writer () {
  var files = new Map()

  return {
    write,
    clear,
    get
  }

  function write (file) {
    return new Promise(function (resolve, reject) {
      pump(file.stream, concat({ encoding: 'buffer' }, saveData), function (err) {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })

      function saveData (data) {
        files.set(file.destination, data)
      }
    })
  }

  function clear () {
    files.clear.bind(files)
  }

  function get (route) {
    return files.get(route)
  }
}
