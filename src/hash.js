// dependencies

var crypto = require('crypto')

// exports

module.exports = hash

// module

function hash (str) {
  // remove comments
  str = str.replace(/--[^\r\n]*/g, '')
  str = str.replace(/\/\*[\w\W]*?(?=\*\/)\*\//g, '')

  // remove whitespace
  str = str.replace(/\s/g, '')

  // accentuate small differences with md5 hash
  return crypto.createHash('md5').update(str).digest('hex')
}
