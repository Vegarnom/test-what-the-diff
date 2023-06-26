import { HttpService } from '@nestjs/axios';
import { GetRequestDto, PostRequestDto } from './dto/request-http.dto';
export declare class RequestHttpService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    getRequest(getReq: GetRequestDto): Promise<any>;
    postRequest(postReq: PostRequestDto): Promise<any>;
    putRequest(postReq: PostRequestDto): Promise<any>;
    deleteRequest(postReq: PostRequestDto): Promise<any>;
}
