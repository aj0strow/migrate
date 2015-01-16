// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var parse = require('../src/parse')
var sync = require('../src/sync')

// tests

describe('sync', function () {
  before(function * () {
    var structs = yield parse.dir(__dirname + '/migrations')
    return yield sync(db, structs)
  })

  it('should create migrations table', function * () {
    var res = yield db.exec('select count(*) from migrations')
    assert.equal('1', res.rows[0].count)
  })
})