// dependencies

var assert = require('assert')

// modules

var db = require('./db')

// tests

describe('pg', function () {
  describe('init', function () {
    it('should be indempotent', function * () {
      yield db.init()
      yield db.init()
    })
  })

  describe('exec', function () {
    it('should allow for args', function * () {
      var rows = yield db.exec('select * from migrations where id = $1;', [ 0 ])
      assert.equal(0, rows.length)
    })
  })
})
