import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { ThirdPartyApiService } from '../third-party-api/third-party-api.service';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { UpdateThirdPartyDto } from './dto/update-third-party.dto';
import { ThirdParty } from './entities/third-party.entity';
import { AuthorizationKioskService } from '../authorization-kiosk/authorization.service';
export declare class ThirdPartyService {
    private readonly thirdPartyRepo;
    private readonly thirdPartyApiService;
    private readonly authorizationKioksService;
    private readonly logger;
    constructor(thirdPartyRepo: Repository<ThirdParty>, thirdPartyApiService: ThirdPartyApiService, authorizationKioksService: AuthorizationKioskService);
    create(createThirdPartyDto: CreateThirdPartyDto): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    findOneByAuthorizationType(authorizationType: string): Promise<ResponseData>;
    update(id: number, updateThirdPartyDto: UpdateThirdPartyDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
    checkDataBeforeCreateAndUpdate(data: any, dataInDB?: any, update?: boolean): Promise<ResponseData>;
}
