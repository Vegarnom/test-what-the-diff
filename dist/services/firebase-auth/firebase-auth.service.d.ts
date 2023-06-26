import { ResponseData } from 'src/common/params/response.data';
import { RequestHttpService } from '../request-http/request-http.service';
export declare class FirebaseAuthService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: RequestHttpService);
    getTokenByUsernamePassword(username: string, password: string): Promise<ResponseData>;
    getAccessTokenByRefeshToken(refreshToken: string): Promise<ResponseData>;
}
