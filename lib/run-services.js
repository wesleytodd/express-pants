'use strict'
const lazyReq = require('import-lazy')(require)
const runnable = require('runnable')
const parallel = require('run-parallel')
const startService = require('./start-service')
const createLoggerr = lazyReq('./create-logger')
const createExpressApp = lazyReq('./create-express-app')
const noop = function () {}

module.exports = function runServices (services, mod, defaults, cb = noop) {
  // Opts is optional
  if (typeof defaults === 'function') {
    cb = defaults
    defaults = {}
  }

  return runnable((o, cb) => {
    // Merge the provided options over the default options
    var opts = Object.assign({}, defaults, o)

    // Create our root express app
    var rootApp = opts.app || createExpressApp(opts)

    // Setup a logger instance
    rootApp.log = createLoggerr(opts)

    // Initalize apps in parallel
    parallel(services.map((service) => {
      return function (done) {
        service(opts, (err, app) => {
          if (err) {
            return done(err)
          }

          // Mount sub apps
          if (rootApp !== app) {
            rootApp.use(app)
          }

          done(null, app)
        })
      }
    }), (err) => {
      // Error in bootstraping module
      if (err) {
        rootApp.log.error(err)
        return cb(err)
      }
      cb(err, rootApp)
    })
  }, [defaults, (err, rootApp) => {
    // Error in bootstraping module
    if (err) {
      rootApp.log.error(err)
      return cb(err)
    }
    startService(rootApp, (err, server) => {
      cb(err, rootApp, server)
    })
  }], mod)
}
