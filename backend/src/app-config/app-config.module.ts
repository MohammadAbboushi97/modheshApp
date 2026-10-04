import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { SettingsModule } from '../settings/settings.module';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ImagesModule, SettingsModule],
  controllers: [AppConfigController],
  providers: [AppConfigService],
})
export class AppConfigModule {}
