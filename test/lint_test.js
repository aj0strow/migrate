// dependencies

var assert = require('assert')

// modules

var parse = require('../src/parse')
var sync = require('../src/sync')
var lint = require('../src/lint')
var db = require('./db')

// tests

describe('lint', function () {
  it('should catch small differences', function * () {
    var structs = yield parse.dir(__dirname + '/migrations')
    yield sync(db, structs)
    structs[0].down = 'drop table if exists users;'
    structs[0].down_hash = parse.hash(structs[0].down)
    var warnings = yield lint(db, structs)
    assert(warnings[0].startsWith('001_create_users'))
  })
})
