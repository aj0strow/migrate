// dependencies

var pg = require('pg')

// exports

module.exports = function (url) {
  return new Connection(url)
}

// module

function Connection (url) {
  this.db = new pg.Client(url)
}

Connection.prototype = {

  // db.exec('sql statement $1', [ 'value' ])
  exec: function (str, args) {
    return new Promise(function (resolve, reject) {
      function cb (e, response) {
        if (e) { return reject(e) }
        resolve(response.rows)
      }
      if (args) {
        this.db.query(str, args, cb)
      } else {
        this.db.query(str, cb)
      }
    }.bind(this))
  },

  // db.connect()
  connect: function () {
    return new Promise(function (resolve, reject) {
      this.db.connect(function (e) {
        if (e) { return reject(e) }
        resolve()
      })
    }.bind(this))
  },

  end: function () {
    this.db.end()
  },
}
