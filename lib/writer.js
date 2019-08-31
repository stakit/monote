var pump = require('pump')
var concat = require('concat-stream')

module.exports = writer

// simple writer that saves the concatinated result into a Map
function writer (files) {
  var files = new Map()

  return {
    write,
    clear,
    get
  }

  function write (file) {
    pump(file.stream, concat({ encoding: 'buffer' }, saveData), function (err) {
      if (err) throw err
    })

    function saveData (data) {
      files.set(file.destination, data)
    }
  }

  function clear () {
    files.clear.bind(files)
  }

  function get (route) {
    return files.get(route)
  }
}
