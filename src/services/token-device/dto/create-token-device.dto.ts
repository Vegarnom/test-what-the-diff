import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDeviceDto {
  @IsNotEmpty()
  brandId: number;

  @IsNotEmpty()
  organigationId: number;

  @IsString()
  @IsNotEmpty()
  valueToken: string;

  @IsString()
  @IsNotEmpty()
  typeToken: string;
}
