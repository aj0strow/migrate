// dependencies

var assert = require('assert')

// modules

var db = require('./db')
var parse = require('../src/parse')
var migrate = require('../src/migrate')

// tests

var SELECT = `
  select * from users
  where name = $1;
`

describe('migrate', function () {
  var structs
  before(function * () {
    structs = yield parse.dir(__dirname + '/migrations')
  })

  describe('up', function () {
    it('should run migrations once', function * () {
      yield migrate.up(db, structs)
      yield migrate.up(db, structs)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })

    it('should allow stop id', function * () {
      yield migrate.up(db, structs, '001')
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(0, rows.length)
    })

    it('should allow stop n', function * () {
      yield migrate.up(db, structs, 1)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(0, rows.length)
    })
  })

  describe('down', function () {
    it('should run migrations once', function * () {
      yield migrate.up(db, structs)
      yield migrate.down(db, structs)
      yield migrate.down(db, structs)
    })

    it('should allow stop id', function * () {
      yield migrate.up(db, structs)
      yield migrate.down(db, structs, '002')
      yield db.exec(SELECT, [ 'AJ' ])
    })

    it('should allow stop n', function * () {
      yield migrate.up(db, structs)
      yield migrate.down(db, structs, 1)
      yield db.exec(SELECT, [ 'AJ' ])
    })
  })

  describe('redo', function () {
    it('should run migrations again', function * () {
      yield migrate.up(db, structs)
      yield migrate.redo(db, structs)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })
  })

  afterEach(function * () {
    return yield db.exec('drop table if exists users;')
  })
})
