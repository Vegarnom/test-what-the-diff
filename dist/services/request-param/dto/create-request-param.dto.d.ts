import { RequestParam } from '../entities/request-param.entity';
export declare class CreateRequestParamDto {
    id: number;
    paramDefault: string;
    paramChange: string;
    type: string[];
    defaultData: string;
    parentId: number;
    children: CreateRequestParamDto[];
    mappingApiId: number;
    delete: boolean;
    fromRequestParam(requestParam: RequestParam): CreateRequestParamDto;
}
