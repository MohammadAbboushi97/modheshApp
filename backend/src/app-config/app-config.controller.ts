import { Controller, Get } from '@nestjs/common';
import { AppConfigResource, AppConfigService } from './app-config.service';

@Controller()
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('api/v1/app-config')
  getAppConfig(): AppConfigResource {
    return this.appConfigService.getClientConfig();
  }
}
