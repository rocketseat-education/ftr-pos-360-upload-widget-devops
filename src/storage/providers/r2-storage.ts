import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { StorageProvider, UploadFileAsStreamInput } from "../storage";
import { basename, extname } from 'node:path';
import { env } from '../../env';

export class R2StorageProvider implements StorageProvider {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    })
  }

  private sanitizeFileName(fileName: string) {
    const ext = extname(fileName)
    const baseName = basename(fileName, ext)
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '')
  
    return sanitizedBaseName.concat(ext)
  }

  public async uploadFileAsStream({
    path,
    contentType,
    stream,
  }: UploadFileAsStreamInput) {
    const key = this.sanitizeFileName(path)

    const upload = new Upload({
      client: this.client,
      params: {
        Key: key,
        Bucket: env.CLOUDFLARE_BUCKET,
        Body: stream,
        ContentType: contentType,
      },
    })
  
    await upload.done()
  
    return {
      url: new URL(key, env.CLOUDFLARE_PUBLIC_URL).toString(),
    }
  }
}