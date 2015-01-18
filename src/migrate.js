// modules

var debug = require('./debug')

// exports 

exports.up = up
exports.down = down
exports.redo = redo

// queries

var SELECT_UPS = `
  select id, up from migrations
  where migrated_at is null
  order by id asc;
`

var UPDATE_UP = `
  update migrations
  set migrated_at = now()
  where id = $1;
`

var SELECT_DOWNS = `
  select id, down from migrations
  where migrated_at is not null
  order by id desc;
`

var UPDATE_DOWN = `
  update migrations
  set migrated_at = null
  where id = $1;
`

// module

// migrate.up(db)
// migrate.up(db, 1)
// migrate.up(db, '002')
function * up (db, limit) {
  var structs = yield db.exec(SELECT_UPS)

  if (Number.isInteger(limit)) {
    structs = structs.slice(0, limit)
  } else if (limit) {
    structs = structs.filter(function (struct) {
      return struct.id <= limit
          || struct.id.startsWith(limit)
    })
  }

  yield structs.map(function (struct) {
    debug('  up %s', struct.id)
    return db.exec(struct.up).then(function () {
      return db.exec(UPDATE_UP, [ struct.id ])
    })
  })
}

// migrate.down(db)
// migrate.down(db, 1)
// migrate.down(db, '001')
function * down (db, limit) {
  var structs = yield db.exec(SELECT_DOWNS)

  if (Number.isInteger(limit)) {
    structs = structs.slice(0, limit)
  } else if (limit) {
    structs = structs.filter(function (struct) {
      return struct.id >= limit
    })
  }

  yield structs.map(function (struct) {
    debug('down %s', struct.id)
    return db.exec(struct.down).then(function () {
      return db.exec(UPDATE_DOWN, [ struct.id ])
    })
  })
}

// migrate.redo(db)
// migrate.redo(db, 3)
function * redo (db, limit) {
  if (!Number.isInteger(limit)) {
    limit = 1
  }
  yield down(db, limit)
  yield up(db)
}
