import z from "zod";
import type { StorageProvider } from "../storage/storage";
import { Readable } from "node:stream";

const uploadImageToStorageRequest = z.object({
  name: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageToStorageRequest = z.input<typeof uploadImageToStorageRequest>

export class UploadImageToStorage {
  constructor(
    private storage: StorageProvider,
  ) {}

  async execute(request: UploadImageToStorageRequest) {
    const { name, contentType, contentStream } = uploadImageToStorageRequest.parse(request)

    const { url } = await this.storage.uploadFileAsStream({
      path: `images/${name}`,
      contentType,
      stream: contentStream,
    })

    return { url }
  }
}