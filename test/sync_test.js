require('dotenv').load()
var pg = require('pg')
var db = new pg.Client(process.env['DATABASE_URL'])

before(function (cb) {
  db.connect(cb)
})

after(function () {
  db.end()
})

var sync = require('../src/sync')
var fs = require('fs')

describe('sync', function () {
  before(function (cb) {
    sync(db, __dirname + '/migrations', cb)
  })

  it('should create migrations table', function (cb) {
    db.query('select count(*) from migrations', function (e, results) {
      if (e) { return cb(e) }
      console.error(e)
      console.log(results)
    })
  })  
})
