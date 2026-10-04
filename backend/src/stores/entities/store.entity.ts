import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfferEntity } from '../../offers/entities/offer.entity';

@Entity({ name: 'Stores' })
export class StoresEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'STORE_NAME', unique: true })
  storeName!: string;

  @Column({ name: 'STORE_ADDRESS', nullable: true })
  address!: string;

  @Column({ name: 'ACTIVE_OFFERS', type: 'bigint', nullable: true })
  activeOffers!: number;

  @Column({ name: 'STORE_RATE', type: 'int', nullable: true })
  storeRate!: number;

  @Column({ name: 'STORE_TYPE', nullable: true })
  storeType!: string;

  @Column({ name: 'LOGO_PATH', nullable: true })
  logoPath!: string;

  @OneToMany(() => OfferEntity, (offer) => offer.store, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  offers!: OfferEntity[];
}
