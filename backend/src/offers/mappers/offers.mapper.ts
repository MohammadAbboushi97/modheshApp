import { Injectable } from '@nestjs/common';
import { OfferEntity } from '../entities/offer.entity';
import { Offer } from '../dto/offer.dto';
import { OfferResource } from '../dto/offer-resource.dto';
import { ImageUrlService } from '../../images/image-url.service';

@Injectable()
export class OffersMapper {
  constructor(private readonly imageUrls: ImageUrlService) {}

  toModelFromResource(resource: OfferResource): Offer {
    const model = new Offer();
    model.offerDescription = resource.offerDescription;
    model.storeName = resource.storeName;
    model.expireDate = resource.expireDate as string;
    model.imagePath = resource.imagePath as string;
    return model;
  }

  toModelFromEntity(entity: OfferEntity): Offer {
    const model = new Offer();
    model.id = entity.id;
    model.offerDescription = entity.offerDescription;
    model.storeName = entity.storeName;
    model.expireDate = entity.expireDate;
    model.creationDate = entity.creationDate;
    model.imagePath = entity.imagePath;
    model.storeId = entity.store?.id;
    model.storeType = entity.store?.storeType;
    return model;
  }

  toResource(model: Offer): OfferResource {
    const resource = new OfferResource();
    resource.id = model.id;
    resource.offerDescription = model.offerDescription;
    resource.storeName = model.storeName;
    resource.expireDate = model.expireDate;
    resource.creationDate = model.creationDate;
    resource.imagePath = model.imagePath;
    resource.imageUrl = this.imageUrls.toUrl(model.imagePath);
    resource.storeId = model.storeId;
    resource.storeType = model.storeType;
    return resource;
  }

  toEntity(model: Offer): OfferEntity {
    const entity = new OfferEntity();
    entity.offerDescription = model.offerDescription;
    entity.storeName = model.storeName;
    entity.expireDate = model.expireDate;
    entity.imagePath = model.imagePath;
    return entity;
  }
}
