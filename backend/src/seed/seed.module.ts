import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresEntity } from '../stores/entities/store.entity';
import { OfferEntity } from '../offers/entities/offer.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoresEntity, OfferEntity])],
  providers: [SeedService],
})
export class SeedModule {}
