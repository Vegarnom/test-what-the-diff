import { IsNotEmpty } from 'class-validator';

export class CreateTypeBrandDeviceDto {
  @IsNotEmpty()
  brandDeviceId: number;

  @IsNotEmpty()
  typeDeviceId: number;

  key: string;
}
