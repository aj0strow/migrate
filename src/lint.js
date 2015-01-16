// dependencies

var flatten = require('lodash').flatten

// modules

var debug = require('./debug')

// exports

module.exports = lint

// queries

var SELECT = `
  select * from migrations
  where id = $1;
`

// module

function * lint (db, structs) {
  var warnings = yield structs.map(function (struct) {
    return lintstruct(db, struct)
  })
  return flatten(warnings)
}

function * lintstruct (db, struct) {
  var rows = yield db.exec(SELECT, [ struct.id ])
  var dbstruct = rows[0]
  var warnings = []
  if (struct.up_hash != dbstruct.up_hash) {
    warnings.push(struct.id + ' up md5 hash has changed!')
  }
  if (struct.down_hash != dbstruct.down_hash) {
    warnings.push(struct.id + ' down md5 hash has changed!')
  }
  return warnings
}
