import { ThirdPartyApiService } from './third-party-api.service';
import { CreateThirdPartyApiDto } from './dto/create-third-party-api.dto';
import { UpdateThirdPartyApiDto } from './dto/update-third-party-api.dto';
import { Response } from 'express';
export declare class ThirdPartyApiController {
    private readonly thirdPartyApiService;
    constructor(thirdPartyApiService: ThirdPartyApiService);
    create(createThirdPartyApiDto: CreateThirdPartyApiDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllByThirdPartyId(res: Response, thirdPartyId: number): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateThirdPartyApiDto: UpdateThirdPartyApiDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
