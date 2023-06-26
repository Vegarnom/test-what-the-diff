import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateTokenDeviceDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    @IsNotEmpty()
    brandId: number;
  
    @IsNotEmpty()
    organigationId: number;
  
    @IsString()
    @IsNotEmpty()
    valueToken: string;
  
    @IsString()
    @IsNotEmpty()
    typeToken: string;
  }