'use strict'
const lazyReq = require('import-lazy')(require)
const Loggerr = lazyReq('loggerr')
const cliFormat = lazyReq('loggerr/formatters/cli')

module.exports = function createLoggerr (opts = {}) {
  var log = opts.logger || Loggerr()
  log.formatter = opts.logFormatter || cliFormat
  if (typeof opts.logLevel !== 'undefined') {
    log.setLevel(opts.logLevel)
  }
  return log
}
