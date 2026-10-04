import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StoresEntity } from '../../stores/entities/store.entity';

@Entity({ name: 'Offers' })
export class OfferEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'OFFER_DESC', nullable: true })
  offerDescription!: string;

  @Column({ name: 'STORE_NAME', nullable: true })
  storeName!: string;

  @Column({ name: 'IMAGE_PATH', nullable: true })
  imagePath!: string;

  @Column({ name: 'EXPIRE_DATE', type: 'date', nullable: true })
  expireDate!: string;

  @Column({ name: 'CREATION_DATE', type: 'date', nullable: true })
  creationDate!: string;

  @ManyToOne(() => StoresEntity, (store) => store.offers, { nullable: false })
  @JoinColumn({ name: 'store_id' })
  store!: StoresEntity;
}
