'use strict'
const path = require('path')
const fs = require('fs')
const {createService} = require('2ex')

// Default options to use when running app1 directly
var defaultOpts = {
  port: 2001,
  logLevel: 'debug',
  views: path.join(__dirname, 'templates')
}

// app1's main function
function app1Main (app, opts, cb) {
  // Setup views
  app.set('views', opts.views)
  app.set('view engine', 'html')
  app.engine('html', function fileViewEnging (p, opts, cb) {
    // @NOTE: dont use this code, this is just to show rendering
    // a template with express without having to load a whole
    // template engine implementation
    fs.readFile(p, 'utf8', cb)
  })

  // Handle some routes
  app.get('/', function (req, res) {
    res.render('index')
  })
  app.get('/foo', function fooHandler (req, res) {
    res.status(200).json({
      route: req.originalUrl,
      app: req.app.get('title'),
      cookies: req.cookies
    })
  })
  cb()
}

// Create a runnable service out of this module
module.exports = createService(module, defaultOpts, app1Main)
