import { IsNotEmpty, IsString } from 'class-validator';

export class DevicesDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  secretKey: string;

  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  keySecretHex: string;
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  hostName: string;

  user: string;

  description: string;
}
