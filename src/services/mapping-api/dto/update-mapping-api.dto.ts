import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateRequestParamDto } from 'src/services/request-param/dto/create-request-param.dto';
import { CreateResponseParamDto } from 'src/services/response-param/dto/create-response-param.dto';

export class UpdateMappingApiDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  endpoint: string;

  requestHeaderParam: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  note: string;

  description: string;

  @IsNotEmpty()
  thirdPartyApiId: number;

  @IsNotEmpty()
  typeBrandId: number;

  @IsArray()
  @IsNotEmpty()
  requestParams: [CreateRequestParamDto];

  @IsArray()
  @IsNotEmpty()
  responseParams: [CreateResponseParamDto];

  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  requestType: string;

  @IsString()
  @IsNotEmpty()
  responseType: string;
}
