import { Injectable } from '@nestjs/common';
import { StoresEntity } from '../entities/store.entity';
import { Stores } from '../dto/stores.dto';
import { StoresResource } from '../dto/stores-resource.dto';
import { ImageUrlService } from '../../images/image-url.service';

@Injectable()
export class StoresMapper {
  constructor(private readonly imageUrls: ImageUrlService) {}

  toModel(resource: StoresResource): Stores {
    const model = new Stores();
    model.storeName = resource.storeName;
    model.address = resource.address as string;
    model.activeOffers = resource.activeOffers as number;
    model.storeRate = resource.storeRate as number;
    model.storeType = resource.storeType as string;
    model.logoPath = resource.logoPath as string;
    return model;
  }

  toModelFromEntity(entity: StoresEntity): Stores {
    const model = new Stores();
    model.id = entity.id;
    model.storeName = entity.storeName;
    model.address = entity.address;
    model.activeOffers = Number(entity.activeOffers ?? 0);
    model.storeRate = entity.storeRate;
    model.storeType = entity.storeType;
    model.logoPath = entity.logoPath;
    return model;
  }

  toResource(model: Stores): StoresResource {
    const resource = new StoresResource();
    resource.id = model.id;
    resource.storeName = model.storeName;
    resource.address = model.address;
    resource.activeOffers = model.activeOffers;
    resource.storeRate = model.storeRate;
    resource.storeType = model.storeType;
    resource.logoPath = model.logoPath;
    resource.logoUrl = this.imageUrls.toUrl(model.logoPath);
    return resource;
  }

  toEntity(model: Stores): StoresEntity {
    const entity = new StoresEntity();
    entity.storeName = model.storeName;
    entity.address = model.address;
    entity.activeOffers = model.activeOffers;
    entity.storeRate = model.storeRate;
    entity.storeType = model.storeType;
    entity.logoPath = model.logoPath;
    return entity;
  }
}
