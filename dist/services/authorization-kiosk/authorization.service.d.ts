import { Repository } from 'typeorm';
import { AuthorizationKiosk } from './entities/authorization-kiosk.entity';
import { AuthorizationKioskDto } from './dto/authorization-kiosk.dto';
import { AuthorizationKioskPMSDto } from './dto/authorization-kiosk-pms.dto';
import { ResponseData } from 'src/common/params/response.data';
import { ThirdPartyService } from '../third-party/third-party.service';
import { TokenProviderService } from '../token-provider/token-provider.service';
import { FirebaseAuthService } from '../firebase-auth/firebase-auth.service';
import { GetAuthorizationKioskPMSDto } from './dto/get-authorization-kiosk-pms.dto';
export declare class AuthorizationKioskService {
    private readonly authorizationKioskRepo;
    private readonly thirdPartyService;
    private readonly tokenProviderService;
    private readonly firebaseAuthService;
    private readonly logger;
    constructor(authorizationKioskRepo: Repository<AuthorizationKiosk>, thirdPartyService: ThirdPartyService, tokenProviderService: TokenProviderService, firebaseAuthService: FirebaseAuthService);
    create(authorizationKioskDto: AuthorizationKioskDto): Promise<ResponseData>;
    createFromPMS(authorizationKioskPMSDto: AuthorizationKioskPMSDto): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    findOneByApiKey(apiKey: string): Promise<ResponseData>;
    findAll(): Promise<ResponseData>;
    findAllByThirdPartyId(thirdPartyId: number): Promise<ResponseData>;
    findOneByThirdPartyId(thirdPartyId: number, organizationId: number): Promise<ResponseData>;
    update(authorizationKioskDto: AuthorizationKioskDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
    getApiKey(apiKey: string): Promise<ResponseData>;
    getAuthByOrgId(getAuthorizationKioskPMSDto: GetAuthorizationKioskPMSDto): Promise<ResponseData>;
    resetApiKey(id: number): Promise<ResponseData>;
    resetAccessToken(authorizationKiosk: AuthorizationKiosk): Promise<ResponseData>;
    getAllIpByApiKey(apikey: boolean, exceptId?: number): Promise<any>;
}
