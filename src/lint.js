// dependencies

var diff = require('diff')
var compact = require('lodash').compact

// exports

module.exports = function * (db, migrations) {
  var rows = yield db.exec(`
    select * from migrations
    order by id asc;
  `)
  var errors = []
  while (rows.length) (function () {
    var row = rows.shift()
    var migration = migrations.shift()

    // check for db migration missing file
    if (!migration || migration.id > row.id) {
      migrations.unshift(migration)
      errors.push({ id: row.id, code: 'delete' })
    }

    // check for new file that is missing migration
    else if (migration.id < row.id) {
      rows.unshift(row)
      errors.push({ id: migration.id, code: 'insert' })
    }

    // check for file changes on migrations
    else if (migration.checksum != row.checksum) {
      errors.push({ id: migration.id, code: 'update', data: diffrow(row, migration) })
    }
  })()
  return errors
}

function diffrow (row, migration) {
  var changes = []
  changes = changes.concat(diff.diffLines(row.up, migration.up))
  changes = changes.concat(diff.diffLines(row.down, migration.down))
  return changes
}
