import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OfferEntity } from './entities/offer.entity';
import { Offer } from './dto/offer.dto';
import { OffersMapper } from './mappers/offers.mapper';

export interface OffersFilter {
  storeId?: number;
  storeType?: string;
}

@Injectable()
export class OffersRepository {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly repo: Repository<OfferEntity>,
    private readonly mapper: OffersMapper,
  ) {}

  async doSave(offer: OfferEntity): Promise<void> {
    await this.repo.save(offer);
  }

  findEntityById(id: number): Promise<OfferEntity | null> {
    return this.repo.findOne({ where: { id }, relations: { store: true } });
  }

  saveEntity(offer: OfferEntity): Promise<OfferEntity> {
    return this.repo.save(offer);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete({ id });
  }

  async deleteByStore(storeId: number): Promise<void> {
    await this.repo.delete({ store: { id: storeId } });
  }

  countByStore(storeId: number): Promise<number> {
    return this.repo.count({ where: { store: { id: storeId } } });
  }

  async renameStore(storeId: number, storeName: string): Promise<void> {
    await this.repo.update({ store: { id: storeId } }, { storeName });
  }

  async findAll(filter: OffersFilter = {}): Promise<Offer[]> {
    const where: FindOptionsWhere<OfferEntity> = {};
    if (filter.storeId !== undefined || filter.storeType) {
      where.store = {
        ...(filter.storeId !== undefined ? { id: filter.storeId } : {}),
        ...(filter.storeType ? { storeType: filter.storeType } : {}),
      };
    }
    const entities = await this.repo.find({
      where,
      relations: { store: true },
      order: { id: 'DESC' },
    });
    return entities.map((e) => this.mapper.toModelFromEntity(e));
  }
}
