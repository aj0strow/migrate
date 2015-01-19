// env

require('dotenv').load()
var DATABASE_URL = process.env['DATABASE_URL']

// modules

var pg = require('../src/pg')

// exports

var db = pg.createClient(DATABASE_URL)
module.exports = db

// module

before(function * () {
  yield db.connect()
  return yield db.init()
})

afterEach(function * () {
  yield db.exec('drop table if exists users;')
  return yield db.exec('truncate migrations cascade;')
})

after(function () {
  db.end()
})
