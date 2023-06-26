import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateResponseParamDto } from './dto/create-response-param.dto';
import { ResponseParam } from './entities/response-param.entity';
export declare class ResponseParamService {
    private readonly responseParamRepo;
    private readonly logger;
    constructor(responseParamRepo: Repository<ResponseParam>);
    createResponseParam(createResponseParamDto: CreateResponseParamDto, parentId?: number): Promise<ResponseParam>;
    createResponseParamList(createResponseParamDtoList: CreateResponseParamDto[], mappingApiId: number, parentId?: number): Promise<ResponseData>;
    findAllByMappingApiId(mappingApiId: number): Promise<any[]>;
    removeByMappingApiId(mappingApiId: number): Promise<void>;
    detect(createResponseParamDtoList: CreateResponseParamDto[]): boolean;
    detectType(responseParam: CreateResponseParamDto): boolean;
    checkIncluded(myArray: any, checkingArray: any): boolean;
    findElementById(responseParams: CreateResponseParamDto[], id: number): CreateResponseParamDto;
}
