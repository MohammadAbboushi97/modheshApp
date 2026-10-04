import { Module } from '@nestjs/common';
import { StoresModule } from '../stores/stores.module';
import { OffersModule } from '../offers/offers.module';
import { ImagesModule } from '../images/images.module';
import { SettingsModule } from '../settings/settings.module';
import { StorageModule } from '../storage/storage.module';
import { AdminAuthService } from './admin-auth.service';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminAuthController, AdminController } from './admin.controller';

@Module({
  imports: [
    StoresModule,
    OffersModule,
    ImagesModule,
    SettingsModule,
    StorageModule,
  ],
  controllers: [AdminAuthController, AdminController],
  providers: [AdminAuthService, AdminGuard, AdminService],
})
export class AdminModule {}
