# 2ex (pronounced 2X)

[![NPM Version](https://img.shields.io/npm/v/2ex.svg)](https://npmjs.org/package/2ex)
[![NPM Downloads](https://img.shields.io/npm/dm/2ex.svg)](https://npmjs.org/package/2ex)
[![Build Status](https://travis-ci.org/wesleytodd/2ex.svg?branch=master)](https://travis-ci.org/wesleytodd/2ex)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

A semi-opinionated framework for setting up Express apps.

## Install

```
$ npm install --save 2ex
```

## Usage

```javascript
const createApp = require('2ex')

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
  message: 'World'
}).then(({ app, server }) => {
  const addr = server.address()
  console.log(`Server started at http://${app.get('host')}:${addr.port}`)
})
```

## What does it do?

This package sets up common requirements for running an Express app in production
with the goal of reducing boilerplate in your applications.  Here is a list of some of those things:

- Uses next gen Express (`5.0.0-alpha.7` at the time of publishing this)
  - See [the GitHub PR for 5.0](https://github.com/expressjs/express/pull/2237) for details
  - New and improved `path-to-regex`
  - Router with basic promise support
- Express app settings
  - Remove `x-powered-by` header
  - Sets query string parsing to `simple` (faster, more secure, planned default for 5.0)
- Set process title (nice for identifying your server process)
- Catch, report and exit on `uncaughtException` and `unhandledRejection`
- Handle and report server `clientError`s
- Parses JSON bodies
- Parses cookies (off by default, turn on by passing `options.parseCookies`
