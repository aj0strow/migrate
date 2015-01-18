// dependencies

var pluck = require('lodash').pluck

// modules

var parse = require('./parse')
var debug = require('./debug')
var hash = require('./hash')

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

var SELECT_IDS = `
  select id from migrations
  where migrated_at <> null;
`

var INSERT = `
  insert into migrations (id, up, down, up_hash, down_hash)
  values ($1, $2, $3, $4, $5);
`

// module

function * sync (db, structs) {
  yield db.exec(CREATE_TABLE)
  var rows = yield db.exec(SELECT_IDS)
  var prevs = new Set(pluck(rows, 'id'))
  structs = structs.filter(function (struct) {
    return !prevs.has(struct.id)
  })
  return yield structs.map(function (struct) {
    debug('sync %s', struct.id)
    return db.exec(INSERT, [ struct.id, struct.up, struct.down, hash(struct.up), hash(struct.down) ])
  })
}
