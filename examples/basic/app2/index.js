'use strict'
const {createService} = require('2ex')

// Default options to use when running app2 directly
var defaultOpts = {
  port: 2002,
  logLevel: 'debug'
}

// app2's main function
function app2Main (app, opts, cb) {
  app.get('/baz', handler)
  app.get('/bar', handler)

  function handler (req, res) {
    res.status(200).json({
      route: req.originalUrl,
      app: req.app.get('title'),
      cookies: req.cookies
    })
  }

  cb()
}

// Create a runnable service out of this module
module.exports = createService(module, defaultOpts, app2Main)
