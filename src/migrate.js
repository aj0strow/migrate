// dependencies

var indexBy = require('lodash').indexBy
var merge = require('lodash').merge

// modules

var debug = require('./debug')
var parse = require('./parse')

// exports 

exports.up = function * (db, heads, options) {
  options = merge({ limit: false }, options)
  var ids = yield selectids(db)

  heads = heads.filter(function (head) {
    return !ids[head.id]
  })

  if (options.limit) {
    heads = heads.slice(0, options.limit)
  }

  var migrations = yield heads.map(parse.body)

  yield migrations.map(function (migration) {
    debug('  up %s', migration.id)

    return db.exec(migration.up).then(function () {
      return db.exec(`
        insert into migrations (id, up, down, checksum, migrated_at)
        values ($1, $2, $3, $4, now());
      `, [ migration.id, migration.up, migration.down, migration.checksum ])
    })
  })

  return migrations
}

exports.down = function * (db, heads, options) {
  options = merge({ limit: 1 }, options)
  var ids = yield selectids(db)

  heads = heads.filter(function (head) {
    return ids[head.id]
  })
  heads = heads.reverse()

  if (options.limit) {
    heads = heads.slice(0, options.limit)
  }

  var migrations = yield heads.map(parse.body)

  yield migrations.map(function (migration) {
    debug('down %s', migration.id)
    return db.exec(migration.down).then(function () {
      return db.exec(`
        delete from migrations
        where id = $1;
      `, [ migration.id ])
    })
  })

  return migrations
}

exports.redo = function * (db, heads, options) {
  options = merge({ limit: 1 }, options)
  yield exports.down(db, heads, options)
  return yield exports.up(db, heads, options)
}

// helpers

function * selectids (db) {
  var rows = yield db.exec('select id from migrations;')
  return indexBy(rows, 'id')
}
