import { IsInt, IsOptional, IsString } from 'class-validator';

export class StoresResource {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  storeName!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  activeOffers?: number;

  @IsOptional()
  @IsInt()
  storeRate?: number;

  @IsOptional()
  @IsString()
  storeType?: string;

  @IsOptional()
  @IsString()
  logoPath?: string;

  // Read-only: resolved from logoPath.
  logoUrl?: string;
}
