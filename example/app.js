var choo = require('choo')
var html = require('choo/html')

var app = choo()

app.route('*', function () {
  return html`
    <body>hello</body>
  `
})

module.exports = app.mount('body')
