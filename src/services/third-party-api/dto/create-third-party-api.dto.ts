import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThirdPartyApiDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  note: string;

  description: string;

  @IsString()
  @IsNotEmpty()
  endpointGetParam: string;

  @IsNotEmpty()
  thirdPartyId: number;

  @IsString()
  @IsNotEmpty()
  method: string;
}
