import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { StorageService } from './storage.service';

@Module({
  imports: [ImagesModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
