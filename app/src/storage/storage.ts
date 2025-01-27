import type { Readable } from "node:stream"

export interface UploadFileAsStreamInput {
  path: string
  stream: Readable
  contentType: string
}

export interface StorageProvider {
  uploadFileAsStream: (input: UploadFileAsStreamInput) => Promise<{ url: string }>
}
