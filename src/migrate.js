// modules

var debug = require('./debug')

// exports 

exports.up = up
exports.down = down

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

function * up (db) {
  var structs = yield db.exec(SELECT_UPS)
  yield structs.map(function (struct) {
    debug('migrate up %s', struct.id)
    return db.exec(struct.up).then(function () {
      return db.exec(UPDATE_UP, [ struct.id ])
    })
  })
}

function * down (db) {
  var structs = yield db.exec(SELECT_DOWNS)
  yield structs.map(function (struct) {
    debug('migrate down %s', struct.id)
    return db.exec(struct.down).then(function () {
      return db.exec(UPDATE_DOWN, [ struct.id ])
    })
  })
}
