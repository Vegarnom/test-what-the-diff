import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  organizationId: number;

  @IsNotEmpty()
  typeBrandId: number;

  @IsString()
  @IsNotEmpty()
  deviceName: string;

  deviceIp: string;

  tokenDeviceId: number;

  isDisable: boolean;

  note: string;
}
