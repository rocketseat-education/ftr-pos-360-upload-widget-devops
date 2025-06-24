import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { fastifyMultipart } from '@fastify/multipart'
//import secret from './infra/secret'
import { log } from './infra/logger'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
//import { DecryptCommand, KMSClient } from '@aws-sdk/client-kms'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

const ssm = new SSMClient({ region: 'us-east-2' })
//const kms = new KMSClient({ region: 'us-east-2' })
const secretManager = new SecretsManagerClient({ region: 'us-east-2' })

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  //const values = await secret.read('/secret/data/widget-server-stg')
  //console.log(values.data.data)
  const value = await ssm.send(new GetParameterCommand(
    { Name: 'CLOUDFLARE_ACCESS_KEY_ID', WithDecryption: true }
  ))
  console.log(value.Parameter?.Value)
  const secret = await secretManager.send(new GetSecretValueCommand({ SecretId: 'stg/widget-server' }))
  console.log(JSON.parse(secret.SecretString))
  //if (value.Parameter?.Value) {
  //  const command = new DecryptCommand({
  //    CiphertextBlob: Buffer.from(value.Parameter.Value, 'base64')
  //})
  //const commandResult = await kms.send(command)
  //const result = new TextDecoder().decode(commandResult.Plaintext)
  //console.log(result)
  //}
  log.info('HTTP server running!!!')
})