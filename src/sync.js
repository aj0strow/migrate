// dependencies

var fs = require('co-fs')
var path = require('path')

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
    migrated_at timestamp
  );
`

var SELECT_ID = `
  select count(*) from migrations
  where id = $1;
`

var INSERT_ID = `
   insert into migrations (id, up, down)
   values ($1, $2, $3);
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
  var res = yield db.exec(SELECT_ID, [ struct.id ])
  if (res.rows[0].count == '1') { return }
  return yield db.exec(INSERT_ID, [ struct.id, struct.up, struct.down ])
}
