import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresEntity } from './entities/store.entity';
import { StoresMapper } from './mappers/stores.mapper';
import { StoreRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoresEntity]), ImagesModule],
  controllers: [StoresController],
  providers: [StoresMapper, StoreRepository, StoresService],
  exports: [StoresService, StoreRepository, StoresMapper],
})
export class StoresModule {}
