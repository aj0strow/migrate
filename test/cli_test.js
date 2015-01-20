// dependencies

var spawn = require('co-child-process')
var assert = require('assert')
var migrate = require.resolve('../bin/migrate')
var pkg = require('../package.json')

// tests

describe('cli', function () {
  it('should output version', function * () {
    var version = yield spawn(migrate, [ 'version' ])
    assert.equal(pkg.version, version.trim())
  })

  it('should migrate up', function * () {
    yield spawn(migrate, [ 'up', '--dir', 'test/migrations' ])
  })
  
  it('should migrate down', function * () {
    yield spawn(migrate, [ 'down', '--dir', 'test/migrations' ])
  })

  it('should migrate redo', function * () {
    yield spawn(migrate, [ 'redo', '--dir', 'test/migrations' ])
  })

  it('should lint', function * () {
    yield spawn(migrate, [ 'lint', '--dir', 'test/migrations' ])
  })
})
