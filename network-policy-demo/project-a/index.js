'use strict'

const env = require('env-var')
const fastify = require('fastify')({
  logger: true
})

const HTTP_PORT = env.get('HTTP_PORT').default(8080).asPortNumber()
const MONGO_URL = env
  .get('MONGO_URL')
  .default('mongodb://mongodb:password@mongodb.project-b.svc.cluster.local:27017/messages')
  .required()
  .asUrlString()

fastify.log.info(`connecting to mongodb using URL: ${MONGO_URL}`)
fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: MONGO_URL
})

fastify.get('/', function (req, reply) {
  const ts = new Date()
  const db = this.mongo.db

  db.collection('messages', (err, col) => {
    if (err) return reply.send(err)

    const msg = {
      headers: req.headers,
      ts
    }

    col.insertOne(msg, (err, result) => {
      if (err) return reply.send(err)

      reply.send(result.ops[0])
    })
  })
})

fastify.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) throw err

  fastify.log.info(`started listening on port ${HTTP_PORT}`)
})
