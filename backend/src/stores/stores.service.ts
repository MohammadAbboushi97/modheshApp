import { Injectable, NotFoundException } from '@nestjs/common';
import { Stores } from './dto/stores.dto';
import { StoresMapper } from './mappers/stores.mapper';
import { StoreRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    private readonly storesMapper: StoresMapper,
    private readonly storeRepository: StoreRepository,
  ) {}

  async doCreate(stores: Stores): Promise<void> {
    const entity = this.storesMapper.toEntity(stores);
    await this.storeRepository.doSave(entity);
  }

  async getAll(storeType?: string): Promise<Stores[]> {
    const entities = await this.storeRepository.findAll(storeType);
    return entities.map((e) => this.storesMapper.toModelFromEntity(e));
  }

  async getById(id: number): Promise<Stores> {
    const entity = await this.storeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Store ${id} not found`);
    }
    return this.storesMapper.toModelFromEntity(entity);
  }
}
