import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStructureOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  description: string;

  parent_id: number;

  @IsNotEmpty()
  @IsNumber()
  structure_id: number;
}
