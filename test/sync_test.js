// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var parse = require('../src/parse')
var sync = require('../src/sync')

// tests

describe('sync', function () {
  it('should create migrations table', function * () {
    var structs = yield parse.dir(__dirname + '/migrations')
    return yield sync(db, structs)
    var rows = yield db.exec('select count(*) from migrations')
    assert.equal('2', rows[0].count)
  })
})
