import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { MappingApiService } from '../mapping-api/mapping-api.service';
import { ResponseCodeDto } from './dto/response-code.dto';
import { ResponseCode } from './entities/response-code.entity';
export declare class ResponseCodeService {
    private readonly responseCodeRepo;
    private readonly mappingApiService;
    private readonly logger;
    constructor(responseCodeRepo: Repository<ResponseCode>, mappingApiService: MappingApiService);
    findAllMappingApiId(mappingApiId: number): Promise<ResponseData>;
    update(listResponseCode: ResponseCodeDto[]): Promise<ResponseData>;
    checkValidate(listResponseCode: ResponseCodeDto[]): boolean;
}
