var tape = require('tape')
var tapePromise = require('tape-promise').default
var getPort = require('get-port')
var devnull = require('dev-null')
var got = require('got')
var monote = require('.')

var test = tapePromise(tape)

test('arguments are checked', function (t) {
  t.plan(3)

  t.rejects(monote, 'throws without arguments')
  t.rejects(monote.bind(null, 5), 'throws if entryPath is not a string')
  t.rejects(monote.bind(null, './asd.js'), 'throws if entry does not exist')
})

test('starts the server', async function (t) {
  t.plan(1)

  var port = await getPort()
  var server = await monote('./example/index.js', { port: port, logStream: devnull() })

  var res = await got('http://localhost:' + port)
  t.ok(res.statusCode === 200, 'server responds')

  server.close()
})

test('response is correct', async function (t) {
  t.plan(3)

  var port = await getPort()
  var server = await monote('./example/index.js', { port: port, logStream: devnull() })

  var res = await got('http://localhost:' + port)
  t.ok(res.statusCode === 200, 'status is 200')
  t.ok(res.body.includes('hello'), 'body contains the correct content')
  t.ok(res.headers['content-type'] === 'text/html', 'content-type is text/html')

  server.close()
})

test('sets mime type', async function (t) {
  t.plan(1)

  var port = await getPort()
  var server = await monote('./example/index.js', { port: port, logStream: devnull() })

  var res = await got('http://localhost:' + port + '/style.css')
  t.ok(res.headers['content-type'] === 'text/css', 'content-type is text/css')

  server.close()
})

test('handles 404', async function (t) {
  t.plan(2)

  var port = await getPort()
  var server = await monote('./example/index.js', { port: port, logStream: devnull() })

  var res = await got('http://localhost:' + port + '/asd/', { throwHttpErrors: false })
  t.ok(res.statusCode === 404, 'status is 404')
  t.ok(res.body.includes('Not Found'), 'body includes Not Found')

  server.close()
})
