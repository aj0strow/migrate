// modules

var parse = require('./parse')
var debug = require('./debug')

// exports

module.exports = sync

// queries

var CREATE_TABLE = `
  create table if not exists migrations (
    id text primary key,
    up text not null,
    down text not null,
    up_hash text not null,
    down_hash text not null,
    migrated_at timestamp
  );
`

var SELECT_ID = `
  select count(*) from migrations
  where id = $1 and migrated_at <> null;
`

var INSERT = `
  insert into migrations (id, up, down, up_hash, down_hash)
  values ($1, $2, $3, $4, $5);
`

// module

function * sync (db, structs) {
  debug('syncing file system')
  yield db.exec(CREATE_TABLE)
  return yield structs.map(function (struct) {
    return syncstruct(db, struct)
  })
}

function * syncstruct (db, struct) {
  var rows = yield db.exec(SELECT_ID, [ struct.id ])
  if (rows[0].count == '0') {
    return db.exec(INSERT, [ struct.id, struct.up, struct.down, struct.up_hash, struct.down_hash ])
  }
}
