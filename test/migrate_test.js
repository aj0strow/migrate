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
  var heads = null

  before(function * () {
    heads = yield parse.heads(__dirname + '/migrations')
  })

  describe('up', function () {
    it('should run migrations once', function * () {
      yield migrate.up(db, heads)
      yield migrate.up(db, heads)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })

    it('should respect limit option', function * () {
      yield migrate.up(db, heads, { limit: 1 })
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(0, rows.length)
    })
  })

  describe('down', function () {
    it('should run migrations once', function * () {
      yield migrate.up(db, heads)
      yield migrate.down(db, heads)
      yield migrate.down(db, heads)
    })

    it('should respect limit option', function * () {
      yield migrate.up(db, heads)
      yield migrate.down(db, heads, { limit: false })
      yield db.exec(SELECT, [ 'AJ' ]).catch(assert)
    })
  })

  describe('redo', function () {
    it('should run migrations again', function * () {
      yield migrate.up(db, heads)
      yield migrate.redo(db, heads)
      var rows = yield db.exec(SELECT, [ 'Gary' ])
      assert.equal(1, rows.length)
    })
  })

  afterEach(function * () {
    return yield db.exec('drop table if exists users;')
  })
})
