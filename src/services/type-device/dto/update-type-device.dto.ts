import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTypeDeviceDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
