// dependencies

var assert = require('assert')

// modules

var hash = require('../src/hash')
var sync = require('../src/sync')
var lint = require('../src/lint')
var db = require('./db')

// tests

describe('lint', function () {
  it('should catch small differences', function * () {
    var struct = {
      id: '001_create_users',
      up: 'create table users (id serial);',
      down: 'drop table users;',
    }
    struct.up_hash = hash(struct.up)
    struct.down_hash = hash(struct.down)
    yield sync(db, [ struct ])
    struct.down = 'drop table user;'
    struct.down_hash = hash(struct.down)
    var warnings = yield lint(db, [ struct ])
    assert(warnings[0].startsWith(struct.id))
  })
})
