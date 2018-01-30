'use strict'
const https = require('https')
const noop = function () {}

// Start the single app
module.exports = function startService (app, cb = noop) {
  var server = app.listen(app.get('port'), app.get('host'), (err) => {
    if (err) {
      app.log.error(err)
      return cb(err)
    }
    var addr = server.address() || {}
    app.log.info(`Server started on ${server instanceof https.Server ? 'https' : 'http'}://${addr.address}:${addr.port}`)
    cb(null, server)
  })
}
