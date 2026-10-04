import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoresEntity } from '../stores/entities/store.entity';
import { OfferEntity } from '../offers/entities/offer.entity';

// Sample data so the mobile app has something to render on a fresh database.
const SAMPLE_STORES: Array<
  Pick<StoresEntity, 'storeName' | 'address' | 'storeRate' | 'storeType' | 'logoPath'>
> = [
  { storeName: 'Adidas', address: 'Amman - Mecca Street', storeRate: 5, storeType: 'Retail', logoPath: 'adida.png' },
  { storeName: 'Apple', address: 'Amman - Abdali Boulevard', storeRate: 5, storeType: 'Retail', logoPath: 'apple.png' },
  { storeName: 'Calvin Klein', address: 'Amman - City Mall', storeRate: 4, storeType: 'Retail', logoPath: 'ck.png' },
  { storeName: 'Dior', address: 'Amman - Taj Mall', storeRate: 4, storeType: 'Retail', logoPath: 'dior.png' },
  { storeName: 'The North Face', address: 'Irbid - University Street', storeRate: 4, storeType: 'Wholesale', logoPath: 'northFace.png' },
  { storeName: 'Tommy Hilfiger', address: 'Zarqa - Main Street', storeRate: 3, storeType: 'Wholesale', logoPath: 'tommy.png' },
  { storeName: 'Versace', address: 'Aqaba - Marina', storeRate: 5, storeType: 'HoReCa', logoPath: 'versace.png' },
  { storeName: 'Chanel', address: 'Amman - Rainbow Street', storeRate: 4, storeType: 'HoReCa', logoPath: 'download.png' },
];

const SAMPLE_OFFERS = [
  'Up to 50% off selected items',
  'Buy one, get one free',
  'Weekend deal: 30% off',
  'Free delivery on orders over 20 JOD',
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(StoresEntity)
    private readonly stores: Repository<StoresEntity>,
    @InjectRepository(OfferEntity)
    private readonly offers: Repository<OfferEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if ((await this.stores.count()) > 0) {
      return;
    }
    const today = new Date();
    const inDays = (days: number) =>
      new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10);

    for (const [i, data] of SAMPLE_STORES.entries()) {
      const count = 2 + (i % 3);
      const store = await this.stores.save(
        this.stores.create({ ...data, activeOffers: count }),
      );
      for (let j = 0; j < count; j++) {
        await this.offers.save(
          this.offers.create({
            offerDescription: `${data.storeName}: ${SAMPLE_OFFERS[(i + j) % SAMPLE_OFFERS.length]}`,
            storeName: data.storeName,
            imagePath: data.logoPath,
            creationDate: inDays(-j),
            expireDate: inDays(7 + i + j),
            store,
          }),
        );
      }
    }
    this.logger.log(`Seeded ${SAMPLE_STORES.length} sample stores`);
  }
}
