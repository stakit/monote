# monote
**Small development server for Stakit**

WIP

Work on static websites using [Stakit](https://github.com/stakit/stakit) without rebuilding them.

<a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
  <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability"/>
</a>
<a href="https://www.npmjs.com/package/monote">
  <img src="https://img.shields.io/npm/v/monote.svg?style=flat-square" alt="NPM version"/>
</a>

## Installation
```
npm i monote
```

## Usage
Export your kit without calling `output()` and let monote handle the rest. Just change your application or your Stakit build chain and monote will automatically rebuild the site using the new version.

```javascript
// build.js
var stakit = require('stakit')

var kit = stakit()
  .routes(() => ['/'])
  .render((route, state) => `${route}`)

if (module.parent) module.exports = kit
else kit.output()
```

Then run:
```
$ monote build.js
```

## CLI
```
usage
  monote [opts] <entry>
options
  --help, -h              show this help text
  --port, -p              server port
  --version, -v           print version
examples
  start server
  monote build.js

  start server on port 3000
  monote build.js -p 3000
```
