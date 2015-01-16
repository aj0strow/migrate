// dependencies

var assert = require('assert')

// modules

var parse = require('../src/parse')

// tests

describe('parse.file', function () {
  it('should separate parts', function (cb) {
    var file = __dirname + '/migrations/001_create_users.sql'
    parse.file(file, function (e, struct) {
      if (e) { return cb(e) }
      assert.equal('001_create_users', struct.id)
      assert.equal('drop table users;', struct.down)
      cb()
    })
  })
})

describe('parse.dir', function () {
  it('should parse all files', function (cb) {
    var dir = __dirname + '/migrations'
    parse.dir(dir, function (e, structs) {
      if (e) { return cb(e) }
      assert.equal(1, structs.length)
      cb()
    })
  })
})
