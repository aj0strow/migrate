// dependencies

var assert = require('assert')

// modules

var lint = require('../src/lint')
var parse = require('../src/parse')
var migrate = require('../src/migrate')
var db = require('./db')

// tests

describe('lint', function () {
  var structs = null
  beforeEach(function * () {
    structs = yield parse.dir(__dirname + '/migrations')
    yield migrate.up(db, structs)
  })

  it('should not catch false positives', function * () {
    var errors = yield lint(db, structs)
    assert.deepEqual([], errors)
  })

  it('should report missing files', function * () {
    var errors = yield lint(db, structs.slice(1))
    var error = errors[0]
    assert.equal('001_create_users', error.id)
    assert.equal('delete', error.code)
  })

  it('should report new files', function * () {
    structs.splice(1, 0, { id: '002_bad_order' })
    var errors = yield lint(db, structs)
    var error = errors[0]
    assert.equal('002_bad_order', error.id)
    assert.equal('insert', error.code)
  })

  it('should catch changed files', function * () {
    structs[0].checksum = 'completely different'
    structs[0].down = 'drop table user;'
    var errors = yield lint(db, structs)
    var error = errors[0]
    assert.equal('001_create_users', error.id)
    assert.equal('update', error.code)
  })
})
