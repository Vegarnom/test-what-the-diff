import { AuthorizationKioskService } from './authorization.service';
import { AuthorizationKioskDto } from './dto/authorization-kiosk.dto';
import { AuthorizationKioskPMSDto } from './dto/authorization-kiosk-pms.dto';
import { GetAuthorizationKioskPMSDto } from './dto/get-authorization-kiosk-pms.dto';
import { Response } from 'express';
export declare class AuthorizationKioskController {
    private readonly authorizationKioskService;
    private readonly logger;
    constructor(authorizationKioskService: AuthorizationKioskService);
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    getApiKey(apiKey: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAuthByOrgId(getAuthorizationKioskPMSDto: GetAuthorizationKioskPMSDto, res: Response): Promise<Response<any, Record<string, any>>>;
    createFromPMS(authorizationKioskPMSDto: AuthorizationKioskPMSDto, res: Response): Promise<Response<any, Record<string, any>>>;
    create(authorizationKioskDto: AuthorizationKioskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    resetApiKey(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(authorizationKioskDto: AuthorizationKioskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
