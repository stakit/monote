var minimist = require('minimist')
var dedent = require('dedent')
var chalk = require('chalk')
var monote = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    version: 'v',
    port: 'p'
  },
  default: {
    port: process.env.PORT || 8080
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
      --help, -h              show this help text
      --port, -p              server port
      --version, -v           print version
    ${chalk.dim('examples')}
      ${chalk.bold('start server')}
      monote build.js

      ${chalk.bold('start server on port 3000')}
      monote build.js -p 3000
  `, '\n')
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

monote(argv._[0], {
  port: argv.port
})
