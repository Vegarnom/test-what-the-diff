import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  organizationId: number;

  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsNotEmpty()
  typeId: number;

  @IsNotEmpty()
  brandId: number;

  deviceIp: string;

  tokenDeviceId: number;

  isDisable: boolean;

  typeBrandId: number;

  note: string;

  isAddBySync: boolean;
}
