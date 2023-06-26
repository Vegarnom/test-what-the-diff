import { ResponseParam } from '../entities/response-param.entity';
export declare class CreateResponseParamDto {
    id: number;
    paramDefault: string;
    paramChange: string;
    type: string[];
    defaultData: string;
    parentId: number;
    children: CreateResponseParamDto[];
    mappingApiId: number;
    delete: boolean;
    fromRequestParam(responseParam: ResponseParam): CreateResponseParamDto;
}
