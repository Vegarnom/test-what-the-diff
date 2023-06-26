import { IsNotEmpty, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateBrandDeviceDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  urlApi: string;

  @IsNotEmpty()
  canSync: boolean;

  @IsNotEmpty()
  typeToken: string;

  url: string;

  key: string;

  @IsFile()
  file: MemoryStoredFile;
}
