// exports 

exports.up = up
exports.down = down

// modules

var debug = require('./debug')

var SELECT_UPS = `
  select id, up from migrations
  where migrated_at is null
  order by id asc;
`

var SET_TIMESTAMP = `
  update migrations
  set migrated_at = now()
  where id = $1;
`

var SELECT_DOWNS = `
  select id, down from migrations
  where migrated_at is not null
  order by id desc;
`

function * up (db, structs) {
  yield structs.map(function (struct) {
    debug('migrate up %s', struct.id)
    return db.exec(struct.up).then(function () {
      return db.exec(SET_TIMESTAMP, [ struct.id ])
    })
  })
}

function * down (db, structs, cb) {

}
