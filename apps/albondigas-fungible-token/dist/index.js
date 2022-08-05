
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ft-standard.cjs.production.min.js')
} else {
  module.exports = require('./ft-standard.cjs.development.js')
}
