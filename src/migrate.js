// dependencies

var indexBy = require('lodash').indexBy

// modules

var debug = require('./debug')

// exports 

exports.up = up
exports.down = down
exports.redo = redo

// queries

var INSERT = `
  insert into migrations (id, up, down, checksum, migrated_at)
  values ($1, $2, $3, $4, now());
`

var DELETE = `
  delete from migrations
  where id = $1;
`

// module

function * up (db, structs, limit) {
  if (arguments.length == 2) { limit = false }

  // exclude previous migrations
  var ids = yield selectids(db)
  structs = structs.filter(function (struct) {
    return !ids[struct.id]
  })

  // limit amount of new migrations
  if (Number.isInteger(limit)) {
    structs = structs.slice(0, limit)
  } else if (limit) {
    structs = structs.filter(function (struct) {
      return struct.id <= limit
          || struct.id.startsWith(limit)
    })
  }

  // run migrations in order
  yield structs.map(function (struct) {
    debug('  up %s', struct.id)
    return db.exec(struct.up).then(function () {
      return db.exec(INSERT, [ struct.id, struct.up, struct.down, struct.checksum ])
    })
  })
}

function * down (db, structs, limit) {
  if (arguments.length == 2) { limit = 1 }

  // exclude new migrations
  var ids = yield selectids(db)
  structs = structs.filter(function (struct) {
    return ids[struct.id]
  })
  structs = structs.reverse()

  // increase amount of rollbacks
  if (Number.isInteger(limit)) {
    structs = structs.slice(0, limit)
  } else if (limit) {
    structs = structs.filter(function (struct) {
      return struct.id >= limit
    })
  }

  // rollback in order
  yield structs.map(function (struct) {
    debug('down %s', struct.id)
    return db.exec(struct.down).then(function () {
      return db.exec(DELETE, [ struct.id ])
    })
  })
}

function * redo (db, structs, limit) {
  if (arguments.length == 2) { limit = 1 }

  yield down(db, structs, limit)
  yield up(db, structs, limit)
}

// helpers

function * selectids (db) {
  var rows = yield db.exec('select id from migrations;')
  return indexBy(rows, 'id')
}
