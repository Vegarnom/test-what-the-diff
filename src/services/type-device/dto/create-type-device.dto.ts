import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeDeviceDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
