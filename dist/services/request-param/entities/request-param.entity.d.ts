import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { CreateRequestParamDto } from '../dto/create-request-param.dto';
export declare class RequestParam extends AbstractEntity {
    id: number;
    paramDefault: string;
    paramChange: string;
    type: string;
    defaultData: string;
    parentId: number;
    mappingApiId: number;
    fromRequestParamDto?(requestParamDto: CreateRequestParamDto): RequestParam;
}
