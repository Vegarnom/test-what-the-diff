import { Response } from 'express';
import { ResponseCodeDto } from './dto/response-code.dto';
import { ResponseCodeService } from './response-code.service';
export declare class ResponseCodeController {
    private readonly reponseCodeService;
    constructor(reponseCodeService: ResponseCodeService);
    getByMappingApiId(mappingApiId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(listResponseCode: ResponseCodeDto[], res: Response): Promise<Response<any, Record<string, any>>>;
}
