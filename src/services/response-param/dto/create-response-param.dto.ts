import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ResponseParam } from '../entities/response-param.entity';

export class CreateResponseParamDto {
  id: number;

  paramDefault: string;

  paramChange: string;

  @IsString()
  @IsNotEmpty()
  type: string[];

  defaultData: string;

  parentId: number;

  @IsArray()
  children: CreateResponseParamDto[];

  mappingApiId: number;

  delete: boolean;

  fromRequestParam(responseParam: ResponseParam): CreateResponseParamDto {
    this.id = responseParam.id;
    this.paramDefault = responseParam.paramDefault;
    this.paramChange = responseParam.paramChange;
    this.type = responseParam.type.split(',');
    this.defaultData = responseParam.defaultData;
    this.children = new Array<CreateResponseParamDto>();
    this.parentId = responseParam.parentId;
    this.mappingApiId = responseParam.mappingApiId;
    return this;
  }
}
