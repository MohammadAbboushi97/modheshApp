import { Injectable, NotFoundException } from '@nestjs/common';
import { Offer } from './dto/offer.dto';
import { OffersMapper } from './mappers/offers.mapper';
import { OffersFilter, OffersRepository } from './offers.repository';
import { StoreRepository } from '../stores/stores.repository';

@Injectable()
export class OffersService {
  constructor(
    private readonly offersMapper: OffersMapper,
    private readonly offersRepository: OffersRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async doCreate(offer: Offer): Promise<void> {
    const store = await this.storeRepository.findByName(offer.storeName);
    if (!store) {
      throw new NotFoundException(`Store ${offer.storeName} not found`);
    }
    const entity = this.offersMapper.toEntity(offer);
    entity.store = store;
    entity.creationDate = new Date().toISOString().slice(0, 10);
    await this.offersRepository.doSave(entity);
  }

  getAll(filter?: OffersFilter): Promise<Offer[]> {
    return this.offersRepository.findAll(filter);
  }
}
