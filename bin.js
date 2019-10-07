#!/usr/bin/env node

var minimist = require('minimist')
var dedent = require('dedent')
var chalk = require('chalk')
var path = require('path')
var stakit = require('stakit')
var monote = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    version: 'v',
    port: 'p',
    output: 'o'
  },
  default: {
    port: process.env.PORT || 8080,
    output: null
  },
  boolean: [
    'version',
    'help'
  ]
})

if (argv.help || argv._.length < 1) {
  console.log(dedent`
    \n${chalk.dim('usage')}
      ${chalk.yellow.bold('monote')} [opts] <entry>
    ${chalk.dim('options')}
      --output, -o            build the site to the specified path
      --help, -h              show this help text
      --port, -p              server port
      --version, -v           print version
    ${chalk.dim('examples')}
      ${chalk.bold('start server')}
      monote build.js

      ${chalk.bold('start server on port 3000')}
      monote build.js -p 3000

      ${chalk.bold('build site without dev server')}
      monote -o ./public build.js
  `, '\n')
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

var entry = resolve(argv._[0])

if (argv.output) {
  var kit = require(entry)
  kit.output(stakit.writeFiles(resolve(argv.output)))
} else {
  monote(entry, {
    port: argv.port,
    logLevel: 'info'
  })
}

function resolve (str) {
  return path.isAbsolute(str) ? str : path.resolve(str)
}
