// dependencies

var fs = require('fs')
var path = require('path')
var async = require('async')

// modules

var debug = require('./debug')

// exports

exports.dir = parsedir
exports.file = parsefile

// module

// Ex:
// parsedir(__dirname + '/migrations', function (e, structs) {
//   typeof structs == 'array'
// })
function parsedir (dir, cb) {
  debug(dir)
  fs.readdir(dir, function (e, files) {
    if (e) { return cb(e) }

    files = files.filter(isSQL).sort()
    debug('%d migrations found', files.length)
    var paths = files.map(function (file) {
      return path.join(dir, file)
    })
    async.map(paths, parsefile, cb)
  })
}

// Ex:
// parsefile(__dirname + '/migration.sql', function (e, struct) {
//   typeof struct == 'object'
// })
function parsefile (file, cb) {
  fs.readFile(file, 'utf8', function (e, str) {
    if (e) { return cb(e) }

    var up = []
    var down = []
    var state = 0

    str.split('\n').forEach(function (line) {
      if (startsWith(line, '--+ up')) {
        state = 1
      } else if (startsWith(line, '--+ down')) {
        state = 2
      } else if (state == 1) {
        up.push(line)
      } else if (state == 2) {
        down.push(line)
      }
    })

    var struct = {
      id: path.basename(file, '.sql'),
      up: up.join('\n').trim(),
      down: down.join('\n').trim(),
    }

    cb(null, struct)
  })
}

// helpers

function isSQL (file) {
  return path.extname(file) == '.sql'
}

function startsWith(str, s) {
  return str.substring(0, s.length) == s
}
