// dependencies

var assert = require('assert')

// modules

var hash = require('../src/hash')

// tests

describe('hash', function () {
  it('should ignore whitespace', function () {
    assert.equal(hash('a  '), hash('a'))
  })

  it('should ignore line comments', function () {
    var sql = '-- comment\n--more\n  create table;'
    assert.equal(hash(sql), hash('create table;'))
  })

  it('should ignore block comments', function () {
    var sql = '/* this is \n not helpful */ create table;'
    assert.equal(hash(sql), hash('create table;'))
  })
})
