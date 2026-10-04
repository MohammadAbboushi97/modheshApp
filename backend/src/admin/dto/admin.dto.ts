import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AdminLoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}

export class AdminStoreDto {
  @IsString()
  @IsNotEmpty()
  storeName!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  storeRate?: number;

  @IsOptional()
  @IsString()
  storeType?: string;

  @IsOptional()
  @IsString()
  logoPath?: string;
}

export class AdminOfferDto {
  @IsString()
  @IsNotEmpty()
  offerDescription!: string;

  @IsInt()
  storeId!: number;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsDateString()
  expireDate?: string;
}
