'use strict'

const { NODE_ENV, KEYCLOAK_CONFIG, SESSION_SECRET } = require('./config')(process.env)
const log = require('./log')
const session = require('express-session')
const Keycloak = require('keycloak-connect')

/**
 * Applies keycloak middleware to an express application if a KEYCLOAK_CONFIG
 * environment variable is set to a valid OIDC JSON from a "public" Keycloak
 * client type
 */
module.exports = (app) => {
  if (KEYCLOAK_CONFIG) {
    log.info('KEYCLOAK_CONFIG was found, applying keycloak middleware')
    // If a keycloak config is found we need to create a session store and
    // middleware, then mount these and keycloak.

    // NOTE: MemoryStore is not designed for use in production
    const store = new session.MemoryStore()
    const sessionInstance = session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Use secure cookies in production
        secure: NODE_ENV === 'production'
      },
      store
    })

    const kc = new Keycloak({ store }, KEYCLOAK_CONFIG)

    // Manages client sessions
    app.use(sessionInstance)

    // Mount the keycloak middleware. Also expose a /logout endpoint
    app.use(kc.middleware({
      logout: '/logout'
    }))

    // Apply keycloak protection to all routes defined after this is called
    app.use(kc.protect())
  }
}
