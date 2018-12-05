'use strict'
// vim: set ts=2 sw=2 expandtab:
var {describe, it} = require('mocha')
var assert = require('assert')
var supertest = require('supertest')
var createApp = require('../')

describe('2ex', function () {
  it('should create and start an express app', function (done) {
    const runApp = createApp((app, opts) => {
      app.get('/', (req, res) => {
        res.send(`hello ${opts.message}`)
      })
    }, {
      message: 'world'
    })

    runApp().then(({ app, server }) => {
      assert(app)
      assert(app.get('2exDefaultOptions').message, 'world')

      supertest(server)
        .get('/')
        .expect(200, 'hello world', () => {
          server.close(done)
        })
    })
  })
})
