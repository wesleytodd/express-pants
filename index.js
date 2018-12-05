'use strict'
// vim: set ts=2 sw=2 expandtab:
const _express = require('express')
const setTitle = require('node-bash-title')
const responseTime = require('response-time')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

module.exports = function createApp (main = () => {}, defaultOptions = {}) {
  // Default options
  const opts = Object.assign({
    express: _express,
    port: 0,
    host: '127.0.0.1',
    exposeExpress: false,
    title: main.name || '2EX Application',
    trustProxy: false,
    queryParser: 'simple',
    responseTime: {},
    parseJson: {},
    parseCookies: false
  }, defaultOptions)

  // Create the express app
  const app = opts.express()

  // Set default options
  app.set('2exDefaultOptions', opts)

  // Bind run method to these options
  return runApp.bind(null, main, app, opts)
}

function runApp (main, app, defaultOptions, options) {
  return new Promise((resolve, reject) => {
    // Merge the provided options over the default options
    let opts = Object.assign({}, defaultOptions, options)

    // Set the process title
    process.title = opts.title
    process.stdout.isTTY && setTitle(opts.title)

    // Server state
    let server
    let serverStarted = false
    let serverClosing = false

    // Catch uncaught errors
    function unhandledError (err) {
      if (serverClosing) {
        return
      }
      serverClosing = err
      app.emit('error', err)

      // Close down server
      if (serverStarted) {
        server.close(() => {
          process.exit(1)
        })
      }
    }
    process.on('uncaughtException', unhandledError)
    process.on('unhandledRejection', unhandledError)

    // Set options on the app
    if (opts.exposeExpress !== true) {
      app.disable('x-powered-by')
    }
    app.set('title', opts.title)
    app.set('port', opts.port)
    app.set('host', opts.host)
    app.set('trust proxy', opts.trustProxy)
    app.set('query parser', opts.queryParser)
    app.set('2exOptions', opts)

    // Add common middleware
    if (opts.responseTime) {
      app.use(responseTime(opts.responseTime))
    }
    if (opts.parseJson) {
      app.use(bodyParser.json(opts.parseJson))
    }
    if (opts.parseCookies) {
      app.use(cookieParser(opts.parseCookies.secret || null, opts.parseCookies))
    }

    // Call main
    let ret = main(app, opts)
    if (ret instanceof Promise) {
      ret.then(startServer, reject)
    } else {
      startServer(ret)
    }

    function startServer (onStarted) {
      server = app.listen(opts.port, opts.host, (err) => {
        if (err) {
          return reject(err)
        }

        // An exception happened at startup, abort
        if (serverClosing) {
          let e = serverClosing
          if (!(e instanceof Error)) {
            e = new Error(typeof e === 'string' ? e : 'Server was closed before it could start')
          }
          return reject(e)
        }

        serverStarted = true
        const onStartedData = { app, server, opts }

        if (typeof onStarted === 'function') {
          let ret = onStarted(onStartedData)
          if (ret instanceof Promise) {
            return ret.then(() => resolve(onStartedData), reject)
          }
        }
        resolve(onStartedData)
      })

      // Handling for server client errors
      // See: https://github.com/expressjs/express/issues/3813#issuecomment-443374037
      server.on('clientError', (err, socket) => {
        app.emit('error', err)

        // Write out a bad request response
        if (socket.writable) {
          socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
        }
        socket.destroy(err)
      })
    }
  })
}
