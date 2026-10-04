import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoresEntity } from './entities/store.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(StoresEntity)
    private readonly repo: Repository<StoresEntity>,
  ) {}

  doSave(store: StoresEntity): Promise<StoresEntity> {
    return this.repo.save(store);
  }

  findAll(storeType?: string): Promise<StoresEntity[]> {
    return this.repo.find({
      where: storeType ? { storeType } : {},
      order: { storeRate: 'DESC' },
    });
  }

  findById(id: number): Promise<StoresEntity | null> {
    return this.repo.findOneBy({ id });
  }

  findByName(storeName: string): Promise<StoresEntity | null> {
    return this.repo.findOneBy({ storeName });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete({ id });
  }
}
