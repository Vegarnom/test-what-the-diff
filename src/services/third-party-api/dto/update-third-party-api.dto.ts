import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateThirdPartyApiDto {
  @IsNotEmpty()
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
