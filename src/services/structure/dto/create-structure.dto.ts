import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  description: string;
}
