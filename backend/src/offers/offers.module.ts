import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersMapper } from './mappers/offers.mapper';
import { OffersRepository } from './offers.repository';
import { OffersService } from './offers.service';
import { StoresModule } from '../stores/stores.module';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferEntity]),
    StoresModule,
    ImagesModule,
  ],
  controllers: [OffersController],
  providers: [OffersMapper, OffersRepository, OffersService],
  exports: [OffersService, OffersRepository, OffersMapper],
})
export class OffersModule {}
