import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { ThirdPartyService } from '../third-party/third-party.service';
import { CreateThirdPartyApiDto } from './dto/create-third-party-api.dto';
import { UpdateThirdPartyApiDto } from './dto/update-third-party-api.dto';
import { ThirdPartyApi } from './entities/third-party-api.entity';
import { MappingApiService } from '../mapping-api/mapping-api.service';
export declare class ThirdPartyApiService {
    private readonly thirdPartyApiRepo;
    private readonly thirdPartyService;
    private readonly mappingApiService;
    private readonly logger;
    constructor(thirdPartyApiRepo: Repository<ThirdPartyApi>, thirdPartyService: ThirdPartyService, mappingApiService: MappingApiService);
    create(createThirdPartyApiDto: CreateThirdPartyApiDto): Promise<ResponseData>;
    findAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    update(id: number, updateThirdPartyApiDto: UpdateThirdPartyApiDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
    removeAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData>;
    checkDataBeforeCreateAndUpdate(data: any, dataInDB?: any, update?: boolean): Promise<ResponseData>;
}
