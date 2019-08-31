var stakit = require('stakit')
var { includeStyle } = require('stakit/transforms')
var { render } = require('stakit-choo')

var app = require('./app')

var kit = stakit()
  .use(stakit.copy({
    [`${__dirname}/style.css`]: '/style.css'
  }))
  .routes(() => ['/'])
  .render(render(app))
  .transform(includeStyle, '/style.css')

module.exports = kit
