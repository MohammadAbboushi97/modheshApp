import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface ImageResource {
  filename: string;
  absolutePath: string;
}

@Injectable()
export class ImagesService implements OnModuleInit {
  private imageStorageLocation!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const configured =
      this.config.get<string>('IMAGE_STORAGE_PATH') ?? 'static/images';
    this.imageStorageLocation = path.resolve(process.cwd(), configured);
    try {
      fs.mkdirSync(this.imageStorageLocation, { recursive: true });
    } catch (err) {
      throw new InternalServerErrorException(
        `Could not create the directory where the uploaded files will be stored: ${(err as Error).message}`,
      );
    }
  }

  loadImageAsResource(fileName: string): ImageResource {
    const normalized = path.normalize(fileName);
    if (normalized.includes('..')) {
      throw new NotFoundException(`File not found ${fileName}`);
    }
    const filePath = path.join(this.imageStorageLocation, normalized);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found ${fileName}`);
    }
    return { filename: path.basename(filePath), absolutePath: filePath };
  }

  loadAllImagesAsResources(): ImageResource[] {
    if (!fs.existsSync(this.imageStorageLocation)) {
      return [];
    }
    return fs
      .readdirSync(this.imageStorageLocation)
      .filter((name) => name.toLowerCase().endsWith('.png'))
      .map((name) => ({
        filename: name,
        absolutePath: path.join(this.imageStorageLocation, name),
      }));
  }

  storeImage(file: { originalname: string; buffer: Buffer }): string {
    const fileName = path.basename(file.originalname);
    if (fileName.includes('..')) {
      throw new InternalServerErrorException(
        `Sorry! Filename contains invalid path sequence ${fileName}`,
      );
    }
    const targetLocation = path.join(this.imageStorageLocation, fileName);
    try {
      fs.writeFileSync(targetLocation, file.buffer);
      return fileName;
    } catch (err) {
      throw new InternalServerErrorException(
        `Could not store file ${fileName}. Please try again! ${(err as Error).message}`,
      );
    }
  }

  getAllPngImagesAsBase64(): string[] {
    return this.loadAllImagesAsResources().map((r) =>
      fs.readFileSync(r.absolutePath).toString('base64'),
    );
  }
}
