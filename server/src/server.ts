import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { fastifyMultipart } from '@fastify/multipart'
//import secret from './infra/secret'
import { log } from './infra/logger'
import { SSMClient } from '@aws-sdk/client-ssm'

const client = new SSMClient({ region: 'us-east-2' });

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  //const values = await secret.read('/secret/data/widget-server-stg');
  //console.log(values.data.data)
  const values = await client.send(new GetParameterCommand( { Name: 'CLOUDFLARE_PUBLIC_URL' } ))
  console.log(values.Parameter?.Value)
  log.info('HTTP server running!!!')
})