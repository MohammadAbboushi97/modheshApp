import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { StoreRepository } from '../stores/stores.repository';
import { StoresMapper } from '../stores/mappers/stores.mapper';
import { StoresResource } from '../stores/dto/stores-resource.dto';
import { StoresEntity } from '../stores/entities/store.entity';
import { OffersRepository } from '../offers/offers.repository';
import { OffersMapper } from '../offers/mappers/offers.mapper';
import { OfferResource } from '../offers/dto/offer-resource.dto';
import { OfferEntity } from '../offers/entities/offer.entity';
import { AdminOfferDto, AdminStoreDto } from './dto/admin.dto';

// Optional text fields: empty input clears the column.
const orNull = <T>(value: T | undefined | null): T =>
  (value === undefined || value === '' ? null : value) as T;

@Injectable()
export class AdminService {
  constructor(
    private readonly stores: StoreRepository,
    private readonly storesMapper: StoresMapper,
    private readonly offers: OffersRepository,
    private readonly offersMapper: OffersMapper,
  ) {}

  async listStores(): Promise<StoresResource[]> {
    const entities = await this.stores.findAll();
    return entities
      .sort((a, b) => a.storeName.localeCompare(b.storeName))
      .map((e) =>
        this.storesMapper.toResource(this.storesMapper.toModelFromEntity(e)),
      );
  }

  async saveStore(dto: AdminStoreDto, id?: number): Promise<StoresResource> {
    const entity = id ? await this.getStoreEntity(id) : new StoresEntity();
    const renamed = !!id && entity.storeName !== dto.storeName.trim();
    entity.storeName = dto.storeName.trim();
    entity.address = orNull(dto.address?.trim());
    entity.storeRate = orNull(dto.storeRate);
    entity.storeType = orNull(dto.storeType?.trim());
    entity.logoPath = orNull(dto.logoPath?.trim());
    if (!id) {
      entity.activeOffers = 0;
    }
    let saved: StoresEntity;
    try {
      saved = await this.stores.doSave(entity);
    } catch (err) {
      if (err instanceof QueryFailedError && /UNIQUE/i.test(err.message)) {
        throw new ConflictException(
          `A store named "${entity.storeName}" already exists`,
        );
      }
      throw err;
    }
    if (renamed) {
      await this.offers.renameStore(saved.id, saved.storeName);
    }
    return this.storesMapper.toResource(
      this.storesMapper.toModelFromEntity(saved),
    );
  }

  async deleteStore(id: number): Promise<void> {
    await this.getStoreEntity(id);
    await this.offers.deleteByStore(id);
    await this.stores.delete(id);
  }

  async listOffers(): Promise<OfferResource[]> {
    const offers = await this.offers.findAll();
    return offers.map((o) => this.offersMapper.toResource(o));
  }

  async saveOffer(dto: AdminOfferDto, id?: number): Promise<OfferResource> {
    let entity: OfferEntity;
    if (id) {
      const existing = await this.offers.findEntityById(id);
      if (!existing) {
        throw new NotFoundException(`Offer ${id} not found`);
      }
      entity = existing;
    } else {
      entity = new OfferEntity();
      entity.creationDate = new Date().toISOString().slice(0, 10);
    }
    const previousStoreId = entity.store?.id;
    const store = await this.stores.findById(dto.storeId);
    if (!store) {
      throw new BadRequestException('Please choose an existing store');
    }
    entity.offerDescription = dto.offerDescription.trim();
    entity.store = store;
    entity.storeName = store.storeName;
    entity.imagePath = orNull(dto.imagePath?.trim());
    entity.expireDate = orNull(dto.expireDate);
    const saved = await this.offers.saveEntity(entity);

    await this.refreshActiveOffers(store.id);
    if (previousStoreId && previousStoreId !== store.id) {
      await this.refreshActiveOffers(previousStoreId);
    }
    return this.offersMapper.toResource(
      this.offersMapper.toModelFromEntity(saved),
    );
  }

  async deleteOffer(id: number): Promise<void> {
    const offer = await this.offers.findEntityById(id);
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }
    await this.offers.delete(id);
    await this.refreshActiveOffers(offer.store.id);
  }

  private async getStoreEntity(id: number): Promise<StoresEntity> {
    const store = await this.stores.findById(id);
    if (!store) {
      throw new NotFoundException(`Store ${id} not found`);
    }
    return store;
  }

  // Keeps the "active offers" count on each store in sync with its offers.
  private async refreshActiveOffers(storeId: number): Promise<void> {
    const store = await this.stores.findById(storeId);
    if (store) {
      store.activeOffers = await this.offers.countByStore(storeId);
      await this.stores.doSave(store);
    }
  }
}
