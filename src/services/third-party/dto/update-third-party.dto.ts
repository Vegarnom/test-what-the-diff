import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateThirdPartyDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  note: string;

  description: string;
}
