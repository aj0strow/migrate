// dependencies

var fs = require('co-fs')
var path = require('path')

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
function * parsedir (dir) {
  debug(dir)
  var files = (yield fs.readdir(dir)).filter(isSQL)
  var paths = files.sort().map(function (file) {
    return path.join(dir, file)
  })
  return yield paths.map(parsefile)
}

// Ex:
// parsefile(__dirname + '/migration.sql', function (e, struct) {
//   typeof struct == 'object'
// })
function * parsefile (file) {
  var str = yield fs.readFile(file, 'utf8')
  var struct = parsestr(str)
  struct.id = path.basename(file, '.sql')
  return struct
}

function parsestr (str) {
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
    up: up.join('\n').trim(),
    down: down.join('\n').trim(),
  }

  return struct
}

// helpers

function isSQL (file) {
  return path.extname(file) == '.sql'
}

function startsWith(str, s) {
  return str.substring(0, s.length) == s
}
