import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  address: string;

  parentId: number;

  @IsNotEmpty()
  structureOrganizationId: number;
}
