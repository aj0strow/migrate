// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var sync = require('../src/sync')
var migrate = require('../src/migrate')

// tests

var struct = {
  id: 'migrate_test_1',
  up: 'create table migrate_tests (name text);',
  down: 'drop table migrate_tests;',
}

var INSERT = `
  insert into migrate_tests (name)
  values ($1);
`

describe('migrate', function () {
  beforeEach(function * () {
    return yield sync(db, [ struct ])
  })

  it('should migrate up', function * () {
    yield migrate.up(db)
    yield db.exec(INSERT, [ 'AJ' ])
  })
  
  it('should migrate down', function * () {
    yield migrate.up(db)
    yield migrate.down(db)
    try {
      yield db.exec(INSERT, [ 'AJ' ])
    } catch (e) {
      assert(/does not exist/.test(e.message))
    }    
  })

  afterEach(function * () {
    return yield db.exec('drop table if exists migrate_tests;')
  })
})
