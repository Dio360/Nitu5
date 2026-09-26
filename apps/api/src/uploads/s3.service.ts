import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/** File storage that speaks S3 — local S3Mock now, R2 later (env swap). */
@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET ?? "nitu5";
    this.client = new S3Client({
      endpoint: process.env.S3_ENDPOINT ?? "http://localhost:9090",
      region: process.env.S3_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "test",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "test",
      },
      forcePathStyle: true,
    });
  }

  async presignedUpload(userId: string, filename: string): Promise<{ uploadUrl: string; fileUrl: string }> {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `u/${userId}/${Date.now()}-${safe}`;
    const uploadUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: 15 * 60 },
    );
    const base = (process.env.S3_ENDPOINT ?? "http://localhost:9090").replace(/\/$/, "");
    return { uploadUrl, fileUrl: `${base}/${this.bucket}/${key}` };
  }
}
