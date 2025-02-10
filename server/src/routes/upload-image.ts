import type { FastifyInstance } from "fastify";
import { UploadImageToStorage } from "../functions/upload-image-to-storage";
import { R2StorageProvider } from "../storage/providers/r2-storage";

const MAXIMUM_FILE_SIZE_IN_BYTES = 1024 * 1024 * 4 // 4mb

export async function uploadImageRoute(app: FastifyInstance) {
  app.post('/uploads', async (request, reply) => {
    const uploadedFile = await request.file({
      limits: { fileSize: MAXIMUM_FILE_SIZE_IN_BYTES },
    })

    if (!uploadedFile) {
      return reply.status(400).send({ message: 'Invalid file provided.' })
    }

    const { filename, file: contentStream, mimetype } = uploadedFile

    const storageProvider = new R2StorageProvider()
    const uploadImageToStorage = new UploadImageToStorage(storageProvider)

    const { url } = await uploadImageToStorage.execute({
      name: filename,
      contentStream,
      contentType: mimetype,
    })

    if (uploadedFile.file.truncated) {
      return reply.status(400).send({
        message: `File size must be a maximum of 4MB..`,
      })
    }

    await reply.status(201).send({ url })
  })
}