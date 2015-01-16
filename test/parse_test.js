// dependencies

var assert = require('assert')

// modules

var parse = require('../src/parse')

// tests

describe('parse.file', function () {
  var file = __dirname + '/migrations/001_create_users.sql'

  it('should separate parts', function * () {
    var struct = yield parse.file(file)
    assert.equal('001_create_users', struct.id)
    assert.equal('drop table users;', struct.down)
  })
})

describe('parse.dir', function () {
  var dir = __dirname + '/migrations'

  it('should parse all files', function * () {
    var structs = yield parse.dir(dir)
    assert.equal(2, structs.length)
  })
})
