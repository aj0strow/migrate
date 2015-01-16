// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var parse = require('../src/parse')
var sync = require('../src/sync')
var migrate = require('../src/migrate')

// tests

var SELECT = `
  select * from users
  where name = $1;
`

describe('migrate', function () {
  beforeEach(function * () {
    var structs = yield parse.dir(__dirname + '/migrations')
    yield sync(db, structs)
  })

  describe('up', function () {
    it('should run migrations once', function * () {
      yield migrate.up(db)
      yield migrate.up(db)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })

    it('should allow stop id', function * () {
      yield migrate.up(db, { id: '001' })
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(0, rows.length)
    })

    it('should allow stop n', function * () {
      yield migrate.up(db, { n: 1 })
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(0, rows.length)
    })
  })

  describe('down', function () {
    it('should run migrations once', function * () {
      yield migrate.down(db)
      yield migrate.up(db)
      yield migrate.down(db)
      yield migrate.down(db)
    })

    it('should allow stop id', function * () {
      yield migrate.up(db)
      yield migrate.down(db, { id: '002' })
      yield db.exec(SELECT, [ 'AJ' ])
    })

    it('should allow stop n', function * () {
      yield migrate.up(db)
      yield migrate.down(db, { n: 1 })
      yield db.exec(SELECT, [ 'AJ' ])
    })
  })

  describe('redo', function () {
    it('should run migrations again', function * () {
      yield migrate.up(db)
      yield migrate.redo(db)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })
  })

  afterEach(function * () {
    return yield db.exec('drop table if exists users;')
  })
})
