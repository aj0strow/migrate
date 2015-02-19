// dependencies

var fs = require('co-fs')
var path = require('path')
var merge = require('lodash').merge

// modules

var debug = require('./debug')
var hash = require('./hash')

// exports

exports.heads = function * (dir) {
  debug(dir)

  // read all sql file descriptors
  var fds = (yield fs.readdir(dir)).filter(isSQL).sort()

  // transform to incomplete migration descriptors
  return fds.map(function (fd) {
    return {
      id: path.basename(fd, '.sql'),
      filename: fd,
      filepath: path.join(dir, fd),
    }
  })
}

exports.body = function * (head) {
  var str = yield fs.readFile(head.filepath, 'utf8')
  return merge({}, head, exports.parse(str))
}

exports.parse = function (str) {
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

  return {
    up: up.join('\n').trim(),
    down: down.join('\n').trim(),
    checksum: hash(str)
  }
}

// helpers

function isSQL (file) {
  return path.extname(file) == '.sql'
}
