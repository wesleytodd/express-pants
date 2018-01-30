'use strict'
const {runServices} = require('2ex')
const app1 = require('../app1')
const app2 = require('../app2')

// Export a runnable module which is comprised
// of of the two apps, by default this will start
// the server when run directly
module.exports = runServices([app1, app2], module, {
  port: 2000,
  logLevel: 'info'
})
