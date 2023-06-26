import { CreateRequestParamDto } from 'src/services/request-param/dto/create-request-param.dto';
import { CreateResponseParamDto } from 'src/services/response-param/dto/create-response-param.dto';
export declare class CreateMappingApiDto {
    id: number;
    endpoint: string;
    requestHeaderParam: string;
    name: string;
    note: string;
    description: string;
    thirdPartyApiId: number;
    typeBrandId: number;
    requestParams: [CreateRequestParamDto];
    responseParams: [CreateResponseParamDto];
    method: string;
    requestType: string;
    responseType: string;
}
