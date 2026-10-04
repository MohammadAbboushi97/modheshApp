import {
  Controller,
  Get,
  Header,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { ImagesService } from './images.service';

interface MobileImageEntry {
  name: string;
  data: string;
}

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Get('homeImage')
  getImage(@Res({ passthrough: true }) res: Response): StreamableFile {
    const imageName = 'app-logo.png';
    const resource = this.imageService.loadImageAsResource(imageName);
    const contentType = ImagesController.resolveContentType(resource.filename);

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${resource.filename}"`,
    });
    return new StreamableFile(fs.createReadStream(resource.absolutePath));
  }

  @Get('all')
  @Header('Content-Type', 'application/json')
  getAllImages(): Array<{ name: string; contentType: string }> {
    const resources = [
      this.imageService.loadImageAsResource('app-logo.png'),
      this.imageService.loadImageAsResource('app-logo1.png'),
    ];
    return resources.map((r) => ({
      name: r.filename,
      contentType: ImagesController.resolveContentType(r.filename),
    }));
  }

  @Get('mobile')
  @Header('Content-Type', 'application/json')
  getImagesForMobile(): MobileImageEntry[] {
    return this.imageService.loadAllImagesAsResources().map((resource) => {
      const bytes = fs.readFileSync(resource.absolutePath);
      const base64Image = bytes.toString('base64');
      return {
        name: resource.filename,
        data: `data:image/png;base64,${base64Image}`,
      };
    });
  }

  @Get('file/:name')
  getImageFile(
    @Param('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const resource = this.imageService.loadImageAsResource(name);
    res.set({
      'Content-Type': ImagesController.resolveContentType(resource.filename),
      'Cache-Control': 'public, max-age=86400',
    });
    return new StreamableFile(fs.createReadStream(resource.absolutePath));
  }

  private static resolveContentType(fileName: string): string {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.gif')) return 'image/gif';
    if (lower.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
  }
}
