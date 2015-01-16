// dependencies

var fs = require('co-fs')
var path = require('path')
var crypto = require('crypto')

// modules

var debug = require('./debug')

// exports

exports.dir = parsedir
exports.file = parsefile
exports.hash = hash

// module

// parsedir('migrations')
function * parsedir (dir) {
  debug(dir)
  var files = (yield fs.readdir(dir)).filter(isSQL)
  var paths = files.sort().map(function (file) {
    return path.join(dir, file)
  })
  return yield paths.map(parsefile)
}

// parsefile('migration.sql')
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
    if (line.startsWith('--+ up')) {
      state = 1
    } else if (line.startsWith('--+ down')) {
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

  struct.up_hash = hash(struct.up)
  struct.down_hash = hash(struct.down)

  return struct
}

function hash (str) {
  // remove comments
  str = str.replace(/--[^\r\n]*/g, '')
  str = str.replace(/\/\*[\w\W]*?(?=\*\/)\*\//g, '')

  // remove whitespace
  str = str.replace(/\s/g, '')

  // accentuate small differences with md5 hash
  return crypto.createHash('md5').update(str).digest('hex')
}

// helpers

function isSQL (file) {
  return path.extname(file) == '.sql'
}
