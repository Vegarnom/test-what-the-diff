import { IsArray, IsNotEmpty } from 'class-validator';
import { RequestParam } from '../entities/request-param.entity';

export class CreateRequestParamDto {
  id: number;

  paramDefault: string;

  paramChange: string;

  @IsArray()
  @IsNotEmpty()
  type: string[];

  defaultData: string;

  parentId: number;

  @IsArray()
  children: CreateRequestParamDto[];

  mappingApiId: number;

  delete: boolean;

  fromRequestParam(requestParam: RequestParam): CreateRequestParamDto {
    this.id = requestParam.id;
    this.paramDefault = requestParam.paramDefault;
    this.paramChange = requestParam.paramChange;
    this.type = requestParam.type.split(',');
    this.defaultData = requestParam.defaultData;
    this.children = new Array<CreateRequestParamDto>();
    this.parentId = requestParam.parentId;
    this.mappingApiId = requestParam.mappingApiId;
    return this;
  }
}
