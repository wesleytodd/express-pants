'use strict'
// vim: set ts=2 sw=2 expandtab:
const createApp = require('../..')

const runApp = createApp((app, opts = {}) => {
  // Handle app errors
  app.on('error', console.error)

  // Load in your routes
  app.get('/', (req, res) => {
    res.send(`Hello ${opts.message}!`)
  })
})

// Start the app
runApp({
  port: 8080,
  message: 'Default'
}).then(({ app, server }) => {
  const addr = server.address()
  console.log(`Server started at http://${app.get('host')}:${addr.port}`)
})
