import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SesameDto {
  @IsString()
  @IsNotEmpty()
  cmd: string;

  @IsString()
  @IsNotEmpty()
  uuid: string;
}

// storage sesame's code cmd and mapping description with Bnb_IoT system
export class SesameLockCodeDto {
  id: number;

  @IsNumber()
  code: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
