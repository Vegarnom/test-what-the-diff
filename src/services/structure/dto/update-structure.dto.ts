import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStructureDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  name: string;

  isDisable: boolean;

  apiKey: string;
}
