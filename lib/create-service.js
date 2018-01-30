'use strict'
const lazyReq = require('import-lazy')(require)
const runnable = require('runnable')
const setTitle = lazyReq('node-bash-title')
const createLoggerr = require('./create-logger')
const startService = require('./start-service')
const createExpressApp = lazyReq('./create-express-app')

module.exports = function createService (mod, defaults, main) {
  // Defaults is optional
  if (typeof defaults === 'function') {
    main = defaults
    defaults = {}
  }

  // Set title of app to main function name if not otherwise specified
  if (!defaults.title && main.name) {
    defaults.title = main.name
  }

  // Create a runnable function
  return runnable((o, cb) => {
    // Merge the provided options over the default options
    var opts = Object.assign({}, defaults, o)

    // Set the process title
    process.title = opts.title
    if (opts.logLevel === 'debug') {
      setTitle(opts.title)
    }

    // Create the express app
    var app = opts.app || createExpressApp(opts)

    // Setup a logger instance
    app.log = createLoggerr(opts)

    // Run the application main
    app.log.debug(`Loading service: ${opts.title}`)
    main(app, opts, (err) => {
      cb(err, app)
    })
  }, [defaults, (err, app) => {
    // Error in bootstraping module
    if (err) {
      return app.log.error(err)
    }
    startService(app)
  }], mod)
}
