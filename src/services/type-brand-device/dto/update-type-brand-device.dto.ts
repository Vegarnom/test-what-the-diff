import { IsNotEmpty } from 'class-validator';

export class UpdateTypeBrandDeviceDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  brandDeviceId: number;

  @IsNotEmpty()
  typeDeviceId: number;

  key: string;

  canSync: boolean;
}
