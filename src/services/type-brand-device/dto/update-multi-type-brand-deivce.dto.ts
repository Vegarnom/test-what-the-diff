import { IsNotEmpty } from "class-validator";

export class UpdateMultiTypeBrandDeviceDto {
    @IsNotEmpty()
    typeDeviceId: number[] = [];

    @IsNotEmpty()
    brandDeviceId: number;
  }