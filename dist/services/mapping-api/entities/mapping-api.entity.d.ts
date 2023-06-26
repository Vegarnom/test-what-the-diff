import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { CreateMappingApiDto } from '../dto/create-mapping-api.dto';
export declare class MappingApi extends AbstractEntity {
    id: number;
    endpoint: string;
    requestHeaderParam: string;
    name: string;
    note: string;
    description: string;
    thirdPartyApiId: number;
    typeBrandId: number;
    method: string;
    requestType: string;
    responseType: string;
    fromCreateMappingApiDto(createMappingApiDto: CreateMappingApiDto): void;
}
