// dependencies

var diff = require('diff')
var compact = require('lodash').compact

// exports

module.exports = lint

// module

var SELECT = `
  select * from migrations
  order by id asc;
`

function * lint (db, structs) {
  structs = structs.slice(0)
  var rows = yield db.exec(SELECT)

  var errors = []
  while (rows.length) (function () {
    var row = rows.shift()
    var struct = structs.shift()

    // check for new file that is missing migration
    if (struct.id < row.id) {
      rows.unshift(row)
      errors.push({ id: struct.id, code: 'insert' })
    }
    
    // check for migration that is missing file
    else if (struct.id > row.id) {
      structs.unshift(struct)
      errors.push({ id: row.id, code: 'delete' })
    }

    // check for file changes on migrations
    else if (struct.checksum != row.checksum) {
      errors.push({ id: struct.id, code: 'update', data: diffstruct(row, struct) })
    }
  })()
  return errors
}

function diffstruct (row, struct) {
  var changes = []
  changes = changes.concat(diff.diffLines(row.up, struct.up))
  changes = changes.concat(diff.diffLines(row.down, struct.down))
  return changes
}
