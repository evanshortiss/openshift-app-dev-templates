'use strict'

const express = require('express')
const helmet = require('helmet')
const probe = require('kube-probe')
const path = require('path')
const exphbs = require('express-handlebars')
const boom = require('@hapi/boom')
const log = require('./lib/log')
const keycloak = require('./lib/keycloak')
const { HTTP_PORT } = require('./lib/config')(process.env)

const app = express()

// Variables that will be available to all views
app.locals.site = {
  title: 'OpenShift Node.js Template',
  description: 'A template for creating a Node.js application that performs server-side rendering and can be secured using Keycloak.'
}

// Required when running behind a load balancer, e.g HAProxy
app.set('trust proxy', true)

// Apply some default web security headers
app.use(helmet())

// Expose static assets in public/
app.use('/', express.static(path.join(__dirname, 'public')))

// Configure server-side rendering
app.engine('handlebars', exphbs())
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'handlebars')

// Add liveness/readiness probes for Kubernetes
probe(app)

// Apply keycloak middleware if it's configured. All routes defined
// below this line are protected if KEYCLOAK_CONFIG was set
keycloak(app)

// Render a default landing page
app.get('/', (req, res) => {
  log.trace('rendering the homepage')
  res.render('index.handlebars')
})

// Provide a friendly 404 page for all unknown routes
app.use((req, res, next) => {
  if (req.headers.accept && req.headers.accept.match(/text\/html|application\/xhtml+xml|application\/xml/ig)) {
    // User typed an invalid url or followed a bad link
    log.warn(`404 - user tried to access ${req.originalUrl}`)
    res.render('not-found.handlebars')
  } else {
    // A resource that we don't have was requested
    next(boom.notFound())
  }
})

// Log errors/exceptions to stderr and return a server error
app.use((err, req, res, next) => {
  log.error(err, `error processing a request ${req.method} ${req.originalUrl}`)

  if (boom.isBoom(err)) {
    res.status(err.output.statusCode).end(err.output.payload.message)
  } else {
    res.status(500).end('Internal Server Error')
  }
})

app.listen(HTTP_PORT, (err) => {
  if (err) {
    log.error(err, 'error starting application')
  } else {
    log.info(`🚀 started listening on port ${HTTP_PORT}`)
  }
})
