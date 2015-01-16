// env

require('dotenv').load()
var DATABASE_URL = process.env['DATABASE_URL']

// modules

var pg = require('../src/pg')

// exports

var db = pg(DATABASE_URL)
module.exports = db

// module

before(function (cb) {
  db.connect(cb)
})

afterEach(function * () {
  return yield db.exec('drop table if exists migrations;')
})

after(function () {
  db.end()
})
