// dependencies

var debug = require('debug')

// modules

var pkg = require('../package.json')

// exports

module.exports = debug(pkg.name)
