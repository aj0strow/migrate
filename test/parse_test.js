// dependencies

var assert = require('assert')

// modules

var parse = require('../src/parse')

// tests

describe('parse.file', function () {
  var file = __dirname + '/migrations/001_create_users.sql'

  it('should separate parts', function * () {
    var struct = yield parse.file(file)
    assert.equal('001_create_users', struct.id)
    assert.equal('drop table users;', struct.down)
  })
})

describe('parse.dir', function () {
  var dir = __dirname + '/migrations'

  it('should parse all files', function * () {
    var structs = yield parse.dir(dir)
    assert.equal(2, structs.length)
  })
})

describe('parse.hash', function () {
  it('should ignore whitespace', function () {
    assert.equal(parse.hash('a  '), parse.hash('a'))
  })

  it('should ignore line comments', function () {
    var sql = '-- comment\n--more\n  create table;'
    assert.equal(parse.hash(sql), parse.hash('create table;'))
  })

  it('should ignore block comments', function () {
    var sql = '/* this is \n not helpful */ create table;'
    assert.equal(parse.hash(sql), parse.hash('create table;'))
  })
})
