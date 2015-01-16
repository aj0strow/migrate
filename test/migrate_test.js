// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var sync = require('../src/sync')
var migrate = require('../src/migrate')

// tests

describe('migrate', function () {
  var struct = {
    id: 'migrate_test_1',
    up: 'create table migrate_tests (name text);',
    down: 'drop table migrate_tests;',
  }

  it('should migrate up and down', function * () {
    yield sync(db, [ struct ])
    yield migrate.up(db, [ struct ])
    try {
      yield db.exec('insert into migrate_tests (name) values ($1);', [ 'AJ' ])
    } catch (e) {
      assert.equal(null, e)
    }
  })
  
  it('should update schema', function () {
    
  })

  it('should keep track of itself', function () {
    
  })

  afterEach(function * () {
    return yield db.exec('drop table if exists migrate_tests;')
  })
})
