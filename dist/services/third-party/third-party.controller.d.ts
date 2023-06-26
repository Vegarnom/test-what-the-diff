import { ThirdPartyService } from './third-party.service';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { UpdateThirdPartyDto } from './dto/update-third-party.dto';
import { Response } from 'express';
export declare class ThirdPartyController {
    private readonly thirdPartyService;
    constructor(thirdPartyService: ThirdPartyService);
    create(createThirdPartyDto: CreateThirdPartyDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(res: Response): Promise<Response<any, Record<string, any>>>;
    findOne(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    update(id: number, updateThirdPartyDto: UpdateThirdPartyDto, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
