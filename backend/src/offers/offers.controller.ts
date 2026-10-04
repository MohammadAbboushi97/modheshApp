import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { OfferResource } from './dto/offer-resource.dto';
import { OffersMapper } from './mappers/offers.mapper';
import { OffersService } from './offers.service';

@Controller()
export class OffersController {
  constructor(
    private readonly offersMapper: OffersMapper,
    private readonly offersService: OffersService,
  ) {}

  @Post('api/v1/offers/create')
  @HttpCode(HttpStatus.OK)
  async createOffer(@Body() offerResource: OfferResource): Promise<void> {
    const offer = this.offersMapper.toModelFromResource(offerResource);
    await this.offersService.doCreate(offer);
  }

  @Get('api/v1/offers/getAll')
  async getAllOffers(
    @Query('storeId') storeId?: string,
    @Query('storeType') storeType?: string,
  ): Promise<OfferResource[]> {
    const offers = await this.offersService.getAll({
      storeId: storeId ? Number(storeId) : undefined,
      storeType,
    });
    return offers.map((o) => this.offersMapper.toResource(o));
  }
}
