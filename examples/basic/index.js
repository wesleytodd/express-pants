// vim: set ts=2 sw=2 expandtab:
'use strict'
const createApp = require('../..')

module.exports = createApp((app, opts = {}) => {
  //
  // Things to do here:
  // - Connect to database
  // - Initalize app options
  // - Setup a health check route
  //
  //
  // Optional handling for server started
  // return function onStarted (err, app, server) {
  //   Things to do here:
  //   - Custom error handling
  //   - Listen for server close to disconnect from a db
  // }
  //

  // Load in your routes
  require('./routes')(app, opts)
}, {
  // Default app options
  message: 'Default'
})
