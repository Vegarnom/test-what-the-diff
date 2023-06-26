import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateRequestParamDto } from './dto/create-request-param.dto';
import { RequestParam } from './entities/request-param.entity';
export declare class RequestParamService {
    private readonly requestParamRepo;
    private readonly logger;
    constructor(requestParamRepo: Repository<RequestParam>);
    createRequestParam(createRequestParamDto: CreateRequestParamDto, parentId?: number): Promise<RequestParam>;
    createRequestParamList(createRequestParamDtoList: CreateRequestParamDto[], mappingApiId: number, parentId?: number): Promise<ResponseData>;
    findAllByMappingApiId(mappingApiId: number): Promise<any[]>;
    findOne(id: number): Promise<ResponseData>;
    removeByMappingApiId(mappingApiId: number): Promise<void>;
    detect(createRequestParamDtoList: CreateRequestParamDto[]): boolean;
    detectType(requestParam: CreateRequestParamDto): boolean;
    checkIncluded(myArray: any, checkingArray: any): boolean;
    findElementById(requestParams: CreateRequestParamDto[], id: number): CreateRequestParamDto;
}
