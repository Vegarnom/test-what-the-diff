import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStructureOrganizationDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
