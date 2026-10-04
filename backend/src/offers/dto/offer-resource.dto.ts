import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class OfferResource {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  offerDescription!: string;

  @IsString()
  storeName!: string;

  @IsOptional()
  @IsDateString()
  expireDate?: string;

  @IsOptional()
  @IsDateString()
  creationDate?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsInt()
  storeId?: number;

  @IsOptional()
  @IsString()
  storeType?: string;

  // Read-only: resolved from imagePath.
  imageUrl?: string;
}
