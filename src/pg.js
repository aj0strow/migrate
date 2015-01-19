// dependencies

var pg = require('pg')
var debug = require('./debug')

// exports

exports.createClient = function (url) {
  return new Client(url)
}

// queries

var CREATE_TABLE = `
  create table if not exists migrations (
    id text primary key,
    up text not null,
    down text not null,
    checksum text not null,
    migrated_at timestamp not null
  );
`

// module

function Client (url) {
  this.url = url
  this.db = new pg.Client(url)
}

Client.prototype = {

  exec: function (str, args) {
    return new Promise(function (done, fail) {
      function callback (e, response) {
        if (e) { return fail(e) }
        done(response.rows)
      }
      if (args) {
        this.db.query(str, args, callback)
      } else {
        this.db.query(str, callback)
      }
    }.bind(this))
  },

  connect: function () {
    return new Promise(function (done, fail) {
      this.db.connect(function (e) {
        if (e) { return fail(e) }
        done()
      })
    }.bind(this))
  },

  init: function () {
    return this.exec(CREATE_TABLE)
  },

  end: function () {
    this.db.end()
  },
}
