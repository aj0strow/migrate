// env

require('dotenv').load()
var DATABASE_URL = process.env['DATABASE_URL']

// dependencies

var pg = require('pg')
var assert = require('assert')

// modules

var sync = require('../src/sync')

// tests

var db = new pg.Client(DATABASE_URL)

before(function (cb) {
  db.connect(cb)
})

after(function () {
  db.end()
})

describe('sync', function () {
  before(function (cb) {
    sync(db, __dirname + '/migrations', cb)
  })

  it('should create migrations table', function (cb) {
    db.query('select count(*) from migrations', function (e, res) {
      if (e) { return cb(e) }
      assert.equal('1', res.rows[0].count)
      cb()
    })
  })
})
