import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImageUrlService } from './image-url.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImageUrlService],
  exports: [ImagesService, ImageUrlService],
})
export class ImagesModule {}
