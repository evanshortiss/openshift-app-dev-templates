'use strict'

const env = require('env-var')
const fastify = require('fastify')({
  logger: true
})

const HTTP_PORT = env.get('HTTP_PORT').default(8080).asPortNumber()
const PG_URL = env
  .get('PG_URL')
  .default('postgres://postgres:password@postgres.project-b.svc.cluster.local:5432/database-name')
  .required()
  .asUrlString()

fastify.register(require('fastify-postgres'), {
  connectionString: PG_URL
})

fastify.log.info(`connecting to postgres using URL: ${PG_URL}`)

fastify.get('/', function (req, reply) {
  fastify.pg.connect((err) => {
    if (err) {
      reply.status(500).send('error occurred when connecting to db')
    } else {
      reply.send('postgres app is alive and kicking')
    }
  })

})

fastify.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) throw err

  fastify.log.info(`started listening on port ${HTTP_PORT}`)
})
