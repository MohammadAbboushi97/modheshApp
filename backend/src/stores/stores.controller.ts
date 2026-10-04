import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { StoresResource } from './dto/stores-resource.dto';
import { StoresMapper } from './mappers/stores.mapper';
import { StoresService } from './stores.service';

@Controller()
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly storesMapper: StoresMapper,
  ) {}

  @Post('api/v1/store/create')
  @HttpCode(HttpStatus.OK)
  async createStore(@Body() resource: StoresResource): Promise<void> {
    const stores = this.storesMapper.toModel(resource);
    await this.storesService.doCreate(stores);
  }

  @Get('api/v1/stores/getAll')
  async getAllStores(
    @Query('storeType') storeType?: string,
  ): Promise<StoresResource[]> {
    const stores = await this.storesService.getAll(storeType);
    return stores.map((s) => this.storesMapper.toResource(s));
  }

  @Get('api/v1/stores/:id')
  async getStore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StoresResource> {
    const store = await this.storesService.getById(id);
    return this.storesMapper.toResource(store);
  }
}
