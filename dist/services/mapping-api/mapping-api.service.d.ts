import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { AuthorizationKioskService } from '../authorization-kiosk/authorization.service';
import { RequestHttpService } from '../request-http/request-http.service';
import { CreateRequestParamDto } from '../request-param/dto/create-request-param.dto';
import { RequestParamService } from '../request-param/request-param.service';
import { ResponseCode } from '../response-code/entities/response-code.entity';
import { ResponseCodeService } from '../response-code/response-code.service';
import { CreateResponseParamDto } from '../response-param/dto/create-response-param.dto';
import { ResponseParamService } from '../response-param/response-param.service';
import { ThirdPartyApiService } from '../third-party-api/third-party-api.service';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { MappingApi } from './entities/mapping-api.entity';
import { TypeDeviceService } from '../type-device/type-device.service';
import { BrandDeviceService } from '../brand-device/brand-device.service';
export declare class MappingApiService {
    private readonly mappingApiRepo;
    private readonly requestParamService;
    private readonly responseParamService;
    private readonly thirdPartyApiService;
    private readonly typeBrandDeviceService;
    private readonly httpService;
    private readonly responseCodeService;
    private readonly authorizationKioskService;
    private readonly typeDeviceService;
    private readonly brandDeviceService;
    private readonly logger;
    constructor(mappingApiRepo: Repository<MappingApi>, requestParamService: RequestParamService, responseParamService: ResponseParamService, thirdPartyApiService: ThirdPartyApiService, typeBrandDeviceService: TypeBrandDeviceService, httpService: RequestHttpService, responseCodeService: ResponseCodeService, authorizationKioskService: AuthorizationKioskService, typeDeviceService: TypeDeviceService, brandDeviceService: BrandDeviceService);
    create(createMappingApiDto: CreateMappingApiDto): Promise<ResponseData>;
    findAllByTypeBrandId(typeBrandId: number): Promise<ResponseData>;
    findOne(id: number): Promise<ResponseData>;
    update(id: number, updateMappingApiDto: UpdateMappingApiDto): Promise<ResponseData>;
    remove(id: number): Promise<ResponseData>;
    removeAllByThirdPartyApiId(thirdPartyApiId: number): Promise<ResponseData>;
    removeAllByTypeBrandId(typeBrandId: number): Promise<ResponseData>;
    request(key: string, name: string, method: string, type: string, body: any, apiKey: any, query: any): Promise<ResponseData | any>;
    getAll(): Promise<ResponseData>;
    mappingParamRequest(body: any, requestParams: CreateRequestParamDto[]): {};
    mappingParamResponse(body: any, responseParams: CreateResponseParamDto[], listResponseCode: ResponseCode[]): {};
    checkRequestAndResponseParams(requestParams?: any[], responseParams?: any[]): ResponseData;
}
