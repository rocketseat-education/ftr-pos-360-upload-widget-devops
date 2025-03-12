import type { FastifyInstance } from "fastify";
import { log } from "../infra/logger"

export async function healthCheckRoute(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    log.info('Acessei a rota e deu certo');
    await reply.status(200).send({ message: 'OK!' })
  })
}