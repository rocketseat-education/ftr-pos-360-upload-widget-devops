import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { fastifyMultipart } from '@fastify/multipart'
import secret from './infra/secret'
import { log } from './infra/logger'

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  const values = await secret.read('/secret/data/widget-server-stg');
  console.log(values.data.data)
  log.info('HTTP server running!!!')
})