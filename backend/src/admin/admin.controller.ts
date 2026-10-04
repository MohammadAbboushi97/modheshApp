import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthService } from './admin-auth.service';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminOfferDto, AdminStoreDto } from './dto/admin.dto';
import { StorageService, UploadedImage } from '../storage/storage.service';
import { SettingsService } from '../settings/settings.service';
import { ImageUrlService } from '../images/image-url.service';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

@Controller('api/admin')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminLoginDto) {
    return this.auth.login(dto.username, dto.password);
  }
}

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly storage: StorageService,
    private readonly settings: SettingsService,
    private readonly imageUrls: ImageUrlService,
  ) {}

  @Get('stores')
  listStores() {
    return this.admin.listStores();
  }

  @Post('stores')
  createStore(@Body() dto: AdminStoreDto) {
    return this.admin.saveStore(dto);
  }

  @Put('stores/:id')
  updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminStoreDto,
  ) {
    return this.admin.saveStore(dto, id);
  }

  @Delete('stores/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteStore(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteStore(id);
  }

  @Get('offers')
  listOffers() {
    return this.admin.listOffers();
  }

  @Post('offers')
  createOffer(@Body() dto: AdminOfferDto) {
    return this.admin.saveOffer(dto);
  }

  @Put('offers/:id')
  updateOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminOfferDto,
  ) {
    return this.admin.saveOffer(dto, id);
  }

  @Delete('offers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOffer(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteOffer(id);
  }

  @Post('uploads')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async upload(@UploadedFile() file?: UploadedImage) {
    const key = await this.storage.saveImage(file);
    return { key, url: this.imageUrls.toUrl(key) };
  }

  @Get('settings')
  getSettings() {
    return this.settings.getAll();
  }

  @Put('settings')
  async updateSettings(@Body() body: Record<string, unknown>) {
    await this.settings.update(body ?? {});
    return this.settings.getAll();
  }

  // Lets the admin page preview image keys.
  @Get('image-url')
  imageBase() {
    return { sample: this.imageUrls.toUrl('KEY') };
  }
}
