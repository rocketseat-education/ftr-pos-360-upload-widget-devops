import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { fastifyMultipart } from '@fastify/multipart'
import Vault from 'node-vault'
import { log } from './infra/logger'

const options: Vault.VaultOptions = {
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:8200',
  token: 'root'
}

const vault = Vault(options)

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  const values = await vault.read('/secret/data/widget-server-stg');
  console.log(values.data.data)
  log.info('HTTP server running!!!')
})