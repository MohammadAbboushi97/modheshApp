import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './offers/entities/offer.entity';
import { StoresEntity } from './stores/entities/store.entity';
import { OffersModule } from './offers/offers.module';
import { StoresModule } from './stores/stores.module';
import { ImagesModule } from './images/images.module';
import { SeedModule } from './seed/seed.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AdminModule } from './admin/admin.module';
import { SettingEntity } from './settings/entities/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('DB_FILE') ?? 'offers.sqlite',
        entities: [OfferEntity, StoresEntity, SettingEntity],
        synchronize: true,
      }),
    }),
    StoresModule,
    OffersModule,
    ImagesModule,
    SeedModule,
    AppConfigModule,
    AdminModule,
  ],
})
export class AppModule {}
