import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import * as path from 'path';
import { ImagesService } from '../images/images.service';

export interface UploadedImage {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// Stores uploaded images in S3 when S3_BUCKET is set, otherwise in the local
// image folder. Returns the image key saved in the database / settings.
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket?: string;
  private readonly prefix: string;
  private readonly s3?: S3Client;

  constructor(
    config: ConfigService,
    private readonly images: ImagesService,
  ) {
    this.bucket = config.get<string>('S3_BUCKET')?.trim() || undefined;
    this.prefix = (config.get<string>('S3_PREFIX') ?? 'uploads/').trim();
    if (this.bucket) {
      const endpoint = config.get<string>('S3_ENDPOINT')?.trim();
      // Credentials come from the standard AWS chain
      // (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY, instance role...).
      this.s3 = new S3Client({
        region: config.get<string>('S3_REGION')?.trim() || 'us-east-1',
        ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
      });
    }
  }

  async saveImage(file?: UploadedImage): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const extension = ALLOWED_TYPES[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Only PNG, JPEG, WebP or GIF images');
    }
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    const fileName = `${Date.now()}-${randomBytes(3).toString('hex')}-${base || 'image'}${extension}`;

    if (!this.s3 || !this.bucket) {
      return this.images.storeImage({
        originalname: fileName,
        buffer: file.buffer,
      });
    }

    const key = `${this.prefix}${fileName}`;
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: 'public, max-age=31536000',
        }),
      );
    } catch (err) {
      this.logger.error(`S3 upload failed: ${(err as Error).message}`);
      throw new InternalServerErrorException('Could not upload the image');
    }
    return key;
  }
}
