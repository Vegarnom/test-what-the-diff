import { IsArray, IsNotEmpty } from 'class-validator';

export class deviceIdDto {
  @IsArray()
  @IsNotEmpty()
  deviceId: [];
}
