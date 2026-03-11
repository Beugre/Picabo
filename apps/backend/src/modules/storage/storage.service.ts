import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucket: string;
  private useLocal: boolean;
  private localUploadDir = './uploads';

  constructor(private configService: ConfigService) {
    this.bucket = configService.get('AWS_S3_BUCKET', 'picabo-uploads');
    const region = configService.get('AWS_REGION', 'us-east-1');
    const accessKeyId = configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');

    this.useLocal = !accessKeyId || !secretAccessKey;

    if (!this.useLocal) {
      this.s3Client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    } else {
      if (!fs.existsSync(this.localUploadDir)) {
        fs.mkdirSync(this.localUploadDir, { recursive: true });
      }
      this.logger.warn('AWS credentials not configured, using local file storage');
    }
  }

  async uploadFile(
    file: Buffer,
    originalName: string,
    folder = 'uploads',
    mimeType = 'application/octet-stream',
  ): Promise<string> {
    const ext = path.extname(originalName);
    const key = `${folder}/${uuidv4()}${ext}`;

    if (this.useLocal) {
      return this.saveLocally(file, key);
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (this.useLocal) {
      return `http://localhost:3000/uploads/${key}`;
    }

    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  private saveLocally(file: Buffer, key: string): string {
    const filePath = path.join(this.localUploadDir, key.replace('/', '-'));
    fs.writeFileSync(filePath, file);
    return `http://localhost:3000/uploads/${path.basename(filePath)}`;
  }
}
