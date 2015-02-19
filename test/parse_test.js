// dependencies

var assert = require('assert')

// modules

var parse = require('../src/parse')

// tests

describe('parse', function () {
  var dir = __dirname + '/migrations'

  it('should read directory', function * () {
    var heads = yield parse.heads(dir)
    assert.equal('001_create_users', heads[0].id)
    assert.equal(2, heads.length)
  })

  it('should read and parse files', function * () {
    var heads = yield parse.heads(dir)
    var body = yield parse.body(heads[0])
    assert.equal(32, body.checksum.length)
  })
})
