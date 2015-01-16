// dependencies

var fs = require('fs')
var path = require('path')
var async = require('async')

// modules

var parse = require('./parse')

// exports

module.exports = sync

// module

func

function sync (db, dir, cb) {
  async.series([
    function (cb) {
      var sql = 'CREATE TABLE IF NOT EXISTS migrations'
              + ' (id text primary key, completed_at integer);'
      exec(sql, [], cb)
    },
    function (cb) {
      parse.dir(dir, function (e, structs) {
        if (e) { return cb(e) }
        async.each(structs, check, cb)
      })
    }
  ], cb)
  
  
}

function checkdir (dir, cb) {
  async.waterfall([
    parse.dir.bind(null, dir),
    checkstructs,
  ], cb)
}

function checkstructs (structs, cb) {
  async.each(structs, checkstruct, cb)
}

function checkstruct (db, struct, cb) {
  var sql = 'SELECT count(*) FROM migrations WHERE id=$1'
  exec(db, sql, [ struct.id ], function (e, results) {
    if (e) { return cb(e) }
    console.log(results)
    cb()
  })
}

function exec (db, sql, args, cb) {
  var exec = function (cb) {
    db.query(sql, args, cb)
  }
  if (cb) { exec(cb) }
  return exec
}
