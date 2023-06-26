import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { CreateResponseParamDto } from '../dto/create-response-param.dto';
export declare class ResponseParam extends AbstractEntity {
    id: number;
    paramDefault: string;
    paramChange: string;
    type: string;
    defaultData: string;
    parentId: number;
    mappingApiId: number;
    fromResponseParamDto?(responseParamDto: CreateResponseParamDto): ResponseParam;
}
