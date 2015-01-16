// dependencies

var fs = require('fs')
var path = require('path')
var async = require('async')

// modules

var parse = require('./parse')
var debug = require('./debug')

// exports

module.exports = sync

// queries

var CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS migrations (id text primary key, completed_at integer);'
var SELECT_ID = 'SELECT count(*) FROM migrations WHERE id=$1;'
var INSERT_ID = 'INSERT INTO migrations (id) VALUES ($1);'

// module

function sync (db, dir, cb) {
  debug('syncing file system')
  async.series([
    function (cb) {
      exec(db, CREATE_TABLE, [], cb)
    },
    function (cb) {
      checkdir(db, dir, cb)
    },
  ], cb)
}

function checkdir (db, dir, cb) {
  async.waterfall([
    function (cb) {
      parse.dir(dir, cb)
    },
    function (structs, cb) {
      checkstructs(db, structs, cb)
    },
  ], cb)
}

function checkstructs (db, structs, cb) {
  async.each(structs, function (struct, cb) {
    checkstruct(db, struct, cb)
  }, cb)
}

function checkstruct (db, struct, cb) {
  exec(db, SELECT_ID, [ struct.id ], function (e, res) {
    if (e) { return cb(e) }
    if (res.rows[0].count == '1') {
      return cb()
    }
    exec(db, INSERT_ID, [ struct.id ], cb)
  })
}

function exec (db, sql, args, cb) {
  var exec = function (cb) {
    if (args.length) {
      db.query(sql, args, cb)
    } else {
      db.query(sql, cb)
    }
  }
  if (cb) { exec(cb) }
  return exec
}
