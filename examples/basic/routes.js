'use strict'
// vim: set ts=2 sw=2 expandtab:

module.exports = function (app, opts = {}) {
  app.get('/', (req, res) => {
    res.send(`Hello ${opts.message}!`)
  })
  app.get('/json', (req, res) => {
    res.send({
      hello: opts.message
    })
  })
}
