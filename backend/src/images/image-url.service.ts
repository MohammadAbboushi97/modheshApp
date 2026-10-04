import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Turns a stored image key (e.g. "offers/summer.png") into a URL clients can
// load. With IMAGE_BASE_URL set (S3 bucket, CloudFront, MinIO...) images are
// read straight from that storage; otherwise they fall back to this server's
// /api/images/file endpoint, returned as a path relative to the API origin.
@Injectable()
export class ImageUrlService {
  private readonly baseUrl?: string;

  constructor(config: ConfigService) {
    const configured = config.get<string>('IMAGE_BASE_URL')?.trim();
    const bucket = config.get<string>('S3_BUCKET')?.trim();
    const region = config.get<string>('S3_REGION')?.trim();
    // Uploading to S3 without an explicit base URL: read from the bucket.
    const fallback =
      bucket && region
        ? `https://${bucket}.s3.${region}.amazonaws.com`
        : undefined;
    const base = configured || fallback;
    this.baseUrl = base ? base.replace(/\/+$/, '') : undefined;
  }

  toUrl(key?: string | null): string | undefined {
    if (!key) {
      return undefined;
    }
    if (/^https?:\/\//i.test(key)) {
      return key;
    }
    const encoded = key
      .replace(/^\/+/, '')
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return this.baseUrl
      ? `${this.baseUrl}/${encoded}`
      : `/api/images/file/${encoded}`;
  }
}
