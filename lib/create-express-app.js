'use strict'
const express = require('express')

module.exports = function (opts = {}) {
  // Create the express app
  var app = express()

  // Disabled powered by express
  if (opts.exposeExpress !== true) {
    app.disable('x-powered-by')
  }

  // Set some options on the app
  app.set('title', opts.title, '2ex Application')
  app.set('port', opts.port || 0)
  app.set('host', opts.host || '127.0.0.1')
  app.set('trust proxy', opts.trustProxy || false)

  return app
}
